import Queue from 'bull'

import * as queues from '../queues'
import * as jobs from '../job-models'

console.log('Queues Loaded:', Object.keys(queues)); // Verifica as chaves dos objetos das filas importadas
console.log('Jobs Loaded:', Object.keys(jobs)); // Verifica as chaves dos objetos dos jobs importados

const allQueues = Object.values(queues).map(queue => {
    console.log('Initializing Queue:', queue.name); // Loga o nome da fila sendo inicializada
    return {
        bull: new Queue(queue.name, { redis: queue.options.redis, settings: { stalledInterval: 0 } })
    };
});

console.log('All Queues:', allQueues);

const allJobs = Object.values(jobs);

console.log('All Jobs:', allJobs);

export default {
    addJob(type, data) {
        let job = allJobs.find(job => job.type === type);

        if (!job) {
            console.error(`Job of type '${type}' not found.`);
            return;
        }

        if (!job.queue) {
            console.error(`Queue not specified for job of type '${type}'.`);
            return;
        }

        let queue = allQueues.find(q => q.bull.name === job.queue);

        if (!queue) {
            console.error(`Queue named '${job.queue}' not found.`);
            return;
        }

        if (!job || !queue) {
            console.error('Job or queue not found for type:', type);
            return;
        }

        if (job.options === undefined) job.options = {};

        console.log('Adding job to queue:', { jobType: type, data });
        queue.bull.add(data, job.options);
    },
    process() {
        allJobs.forEach(job => {
            let queue = allQueues.find(q => q.bull.name === job.queue);
            if (!queue) {
                console.error('Queue not found for job:', job);
                return;
            }
            console.log('Processing job:', job);
            queue.bull.process(job.handle);

            queue.bull.on('failed', (job, err) => {
                console.error('Job failed', job.queue, job.data);
                console.error(err);
            });
        });
    }
}