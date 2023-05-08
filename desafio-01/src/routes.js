import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
              completed_at: search,
              created_at: search,
              updated_at: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', tasks);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const oldTask = database.select('tasks', { id })[0];

      console.log(oldTask);

      if (oldTask === undefined) {
        return res.writeHead(404).end();
      }

      database.delete('tasks', id);
      return res.writeHead(204).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const oldTask = database.select('tasks', { id })[0];

      if (oldTask === undefined) {
        return res.writeHead(404).end();
      }

      database.update('tasks', id, {
        title: title ? title : oldTask.title,
        description: description ? description : oldTask.description,
        completed_at: oldTask.completed_at,
        created_at: oldTask.created_at,
        updated_at: new Date(),
      });
      return res.writeHead(204).end();
    },
  },
];
