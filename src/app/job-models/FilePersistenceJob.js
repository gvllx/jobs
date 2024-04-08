import Q from '../queues/PersistenceJobsQueue'
import defs from '../lib/GlobalDefs'
import fs from 'fs'

export default {
    queue: Q.name,
    type: defs.JobType.PersistenceJob,
    handle: function ({ data }) {
        return new Promise((resolve, reject) => {
            const { user } = data;

            fs.writeFile('./userdata.txt', `${user.name}\n${user.email}`, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                    reject(err); // Rejeita a promessa se houver um erro
                } else {
                    resolve('File written successfully'); // Resolve com uma mensagem de sucesso
                }
            });
        });
    }
}