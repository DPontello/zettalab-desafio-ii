const { Router } = require("express");
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");
const TaskController = require("./controllers/TaskController");
const TagController = require("./controllers/TagController");
const SubtaskController = require("./controllers/SubtaskController");
const HealthController = require("./controllers/HealthController");
const DebugController = require("./controllers/DebugController");
const authMiddleware = require("./middlewares/auth");
const TagValidator = require("./validators/TagValidator");
const SubtaskValidator = require("./validators/SubtaskValidator");

const routes = new Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *   - name: Users
 *   - name: Tasks
 *   - name: Tags
 *   - name: Subtasks
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

// Debug endpoints (disabled in production)
routes.get("/debug/data", DebugController.data);
routes.post("/debug/reset", DebugController.reset);

routes.use(authMiddleware);

/**
 * @swagger
 * /me:
 *   get:
 *     tags: [Users]
 *     summary: Retorna o usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: Token invalido
 */
routes.get("/me", UserController.me);

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
/**
 * @swagger
 * /tags:
 *   get:
 *     tags: [Tags]
 *     summary: Lista todas as tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tags
 *   post:
 *     tags: [Tags]
 *     summary: Cria uma nova tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *                 pattern: '^#[0-9A-Fa-f]{6}$'
 *     responses:
 *       201:
 *         description: Tag criada
 */
routes.get("/tags", TagController.index);
routes.post("/tags", TagValidator.store, TagController.store);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: Obtem uma tag
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
 *         description: Tag encontrada
 *   put:
 *     tags: [Tags]
 *     summary: Atualiza uma tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag atualizada
 *   delete:
 *     tags: [Tags]
 *     summary: Remove uma tag
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
 *         description: Tag removida
 */
routes.get("/tags/:id", TagController.show);
routes.put("/tags/:id", TagValidator.update, TagController.update);
routes.delete("/tags/:id", TagController.delete);

/**
 * @swagger
 * /tasks/{taskId}/tags/{tagId}:
 *   post:
 *     tags: [Tags]
 *     summary: Associa uma tag a uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag associada
 *   delete:
 *     tags: [Tags]
 *     summary: Remove a associacao de uma tag de uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag desassociada
 */
routes.post("/tasks/:taskId/tags/:tagId", TagController.attachToTask);
routes.delete("/tasks/:taskId/tags/:tagId", TagController.detachFromTask);

/**
 * @swagger
 * /tasks/{taskId}/subtasks:
 *   get:
 *     tags: [Subtasks]
 *     summary: Lista subtarefas de uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de subtarefas
 *   post:
 *     tags: [Subtasks]
 *     summary: Cria uma subtarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               position:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subtarefa criada
 */
routes.get("/tasks/:taskId/subtasks", SubtaskController.index);
routes.post("/tasks/:taskId/subtasks", SubtaskValidator.store, SubtaskController.store);

/**
 * @swagger
 * /subtasks/{id}:
 *   get:
 *     tags: [Subtasks]
 *     summary: Obtem uma subtarefa
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
 *         description: Subtarefa encontrada
 *   put:
 *     tags: [Subtasks]
 *     summary: Atualiza uma subtarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               position:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Subtarefa atualizada
 *   delete:
 *     tags: [Subtasks]
 *     summary: Remove uma subtarefa
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
 *         description: Subtarefa removida
 */
routes.get("/subtasks/:id", SubtaskController.show);
routes.put("/subtasks/:id", SubtaskValidator.update, SubtaskController.update);
routes.delete("/subtasks/:id", SubtaskController.delete);

/**
 * @swagger
 * /subtasks/{id}/toggle:
 *   patch:
 *     tags: [Subtasks]
 *     summary: Alterna status de completude de uma subtarefa
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
 *         description: Status alterado
 */
routes.patch("/subtasks/:id/toggle", SubtaskController.toggleComplete);

routes.delete("/tasks/:id", TaskController.delete);

module.exports = routes;
