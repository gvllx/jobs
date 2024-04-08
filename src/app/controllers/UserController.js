import passwordGenerator from 'password-generator'
import GlobalDefs from "../lib/GlobalDefs";
import Queues from '../lib/Queue'

export default {
    store(req, res) {
        const {name, email} = req.body

        const user = {
            name: name,
            email: email,
            password: passwordGenerator(15, false)
        }

        let emailData = {
            sender: '<rh@demomailtrap.com>',
            subject: 'Bem vindo!',
            recipient_name: user.name,
            recipient_email: user.email,
            message: `Parabéns, ${user.name}, vc foi contratado, bem vindo <br>` + `Sua senha temporária é: '${user.password}'`
        }

        Queues.addJob(GlobalDefs.JobType.MailJob, {emailData})

        emailData = {
            sender: '<system@demomailtrap.com>',
            subject: 'Novo Colaborador!',
            recipient_name: 'Developer Manager',
            recipient_email: 'it-manager@demomailtrap.com',
            message: `Atenção novo colaborador contratado. <br> Nome: ${user.name}`
        }

        Queues.addJob(GlobalDefs.JobType.MailJob, {emailData})
        Queues.addJob(GlobalDefs.JobType.PersistenceJob, {user})

        return res.json(user)
    }
}