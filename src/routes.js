const { Router } = require("express");
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");
const TaskController = require("./controllers/TaskController");
const HealthController = require("./controllers/HealthController");
const authMiddleware = require("./middlewares/auth");

const routes = new Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *   - name: Users
 *   - name: Tasks
 *   - name: Health
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Cria um novo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario criado
 */
routes.post("/users", UserController.store);

/**
 * @swagger
 * /sessions:
 *   post:
 *     tags: [Auth]
 *     summary: Autentica usuario e retorna token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gerado
 */
routes.post("/sessions", SessionController.store);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verifica status da API
 *     responses:
 *       200:
 *         description: API OK
 */
routes.get("/health", HealthController.index);

routes.use(authMiddleware);

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Lista tarefas do usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED]
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *   post:
 *     tags: [Tasks]
 *     summary: Cria uma tarefa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED]
 *     responses:
 *       201:
 *         description: Tarefa criada
 */
routes.get("/tasks", TaskController.index);
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Obtem uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *       404:
 *         description: Tarefa nao encontrada
 *   put:
 *     tags: [Tasks]
 *     summary: Atualiza uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED]
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *   delete:
 *     tags: [Tasks]
 *     summary: Remove uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarefa removida
 */
routes.get("/tasks/:id", TaskController.show);
routes.post("/tasks", TaskController.store);
routes.put("/tasks/:id", TaskController.update);
routes.delete("/tasks/:id", TaskController.delete);

module.exports = routes;
