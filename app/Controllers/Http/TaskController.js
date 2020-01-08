'use strict'

/* Model Task */
const Task = use('App/Models/Task')

/* validação de formulario um por um */
//const { validate } = use('Validator')

/* validação de formulario todos de uma vez */
const { validateAll } = use('Validator')

class TaskController {
    async index({ view }) {
        const tasks = await Task.all()

        return view.render('tasks', {
            title: 'Latest tasks ',
            tasks: tasks.toJSON()
        })
    }

    async store({request, response, session}){

        /* personalização de mensagens */
        const message = {
            'title.required':'Required',
            'title.min':'Min 3'
        }

        /* Regras  de validação */
        const validation = await validateAll(request.all(),{
            title: 'required|min:5|max:40',
            body: 'required|min:10'
        }, message)

        
        /* if para ver se validou */
        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }


        /* pega os dados  */
        const task = new Task()
        task.title = request.input('title')
        task.body = request.input('body')

        /* Salva os dados  */
        await task.save()

        /* Envia um flash com mensagem */
        session.flash({ notification: 'Task added!' })

        /* redireciona para a rota */
        return response.redirect('/tasks')
    }
}

module.exports = TaskController
