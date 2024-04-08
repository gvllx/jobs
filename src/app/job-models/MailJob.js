import Q from '../queues/MailJobsQueue'
import defs from '../lib/GlobalDefs'
import Mail from "../lib/Mail"

export default {
    queue: Q.name,
    type: defs.JobType.MailJob,
    async handle({ data }) {
        const { emailData } = data;

        try {
            await Mail.sendMail({
                from: emailData.sender,
                to: `${emailData.recipient_name} <${emailData.recipient_email}>`,
                subject: emailData.subject,
                html: emailData.message
            });

            // Retorna uma mensagem de sucesso ou qualquer outro resultado relevante.
            return 'Email sent successfully';
        } catch (error) {
            // Em caso de erro, você pode lançar o erro ou retorná-lo,
            // dependendo de como você deseja lidar com erros no evento 'failed'.
            throw error;
        }
    }
}