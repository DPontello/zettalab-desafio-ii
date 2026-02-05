const request = require("supertest");
const app = require("../../src/app");
const connection = require("../../src/models");

const createUserAndToken = async () => {
  const payload = {
    name: "Joao",
    email: "joao@test.com",
    password: "123456"
  };

  await request(app).post("/users").send(payload);

  const loginResponse = await request(app).post("/sessions").send({
    email: payload.email,
    password: payload.password
  });

  return loginResponse.body.token;
};

describe("Task Manager API", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("registers and logs in", async () => {
    const userPayload = {
      name: "Maria",
      email: "maria@test.com",
      password: "123456"
    };

    const registerResponse = await request(app).post("/users").send(userPayload);
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.email).toBe(userPayload.email);

    const loginResponse = await request(app).post("/sessions").send({
      email: userPayload.email,
      password: userPayload.password
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
  });

  it("creates, lists, updates and deletes tasks", async () => {
    const token = await createUserAndToken();

    const createResponse = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Estudar",
        description: "Revisar Node.js",
        status: "PENDING"
      });

    expect(createResponse.status).toBe(201);

    const listResponse = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.length).toBe(1);

    const taskId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "COMPLETED" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe("COMPLETED");

    const deleteResponse = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);
  });

  it("creates and manages tags", async () => {
    const token = await createUserAndToken();

    const createTagResponse = await request(app)
      .post("/tags")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Urgente",
        color: "#FF0000"
      });

    expect(createTagResponse.status).toBe(201);
    expect(createTagResponse.body.name).toBe("Urgente");
    expect(createTagResponse.body.color).toBe("#FF0000");

    const listTagsResponse = await request(app)
      .get("/tags")
      .set("Authorization", `Bearer ${token}`);

    expect(listTagsResponse.status).toBe(200);
    expect(listTagsResponse.body.length).toBeGreaterThan(0);

    const tagId = createTagResponse.body.id;

    const updateTagResponse = await request(app)
      .put(`/tags/${tagId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ color: "#00FF00" });

    expect(updateTagResponse.status).toBe(200);
    expect(updateTagResponse.body.color).toBe("#00FF00");
  });

  it("associates tags with tasks", async () => {
    const token = await createUserAndToken();

    const taskResponse = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Projeto ZettaLab",
        description: "Completar desafio",
        status: "PENDING"
      });

    const tagResponse = await request(app)
      .post("/tags")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Importante",
        color: "#0000FF"
      });

    const taskId = taskResponse.body.id;
    const tagId = tagResponse.body.id;

    const attachResponse = await request(app)
      .post(`/tasks/${taskId}/tags/${tagId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(attachResponse.status).toBe(200);

    const getTaskResponse = await request(app)
      .get(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getTaskResponse.status).toBe(200);
    expect(getTaskResponse.body.tags).toBeDefined();
    expect(getTaskResponse.body.tags.length).toBe(1);
    expect(getTaskResponse.body.tags[0].name).toBe("Importante");

    const detachResponse = await request(app)
      .delete(`/tasks/${taskId}/tags/${tagId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(detachResponse.status).toBe(200);
  });

  it("creates and manages subtasks", async () => {
    const token = await createUserAndToken();

    const taskResponse = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Desenvolver API",
        description: "API REST com Node.js",
        status: "PENDING"
      });

    const taskId = taskResponse.body.id;

    const createSubtaskResponse = await request(app)
      .post(`/tasks/${taskId}/subtasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Criar modelos",
        completed: false,
        position: 1
      });

    expect(createSubtaskResponse.status).toBe(201);
    expect(createSubtaskResponse.body.title).toBe("Criar modelos");

    const listSubtasksResponse = await request(app)
      .get(`/tasks/${taskId}/subtasks`)
      .set("Authorization", `Bearer ${token}`);

    expect(listSubtasksResponse.status).toBe(200);
    expect(listSubtasksResponse.body.length).toBe(1);

    const subtaskId = createSubtaskResponse.body.id;

    const toggleResponse = await request(app)
      .patch(`/subtasks/${subtaskId}/toggle`)
      .set("Authorization", `Bearer ${token}`);

    expect(toggleResponse.status).toBe(200);
    expect(toggleResponse.body.completed).toBe(true);

    const updateSubtaskResponse = await request(app)
      .put(`/subtasks/${subtaskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Criar modelos atualizados"
      });

    expect(updateSubtaskResponse.status).toBe(200);
    expect(updateSubtaskResponse.body.title).toBe("Criar modelos atualizados");

    const deleteSubtaskResponse = await request(app)
      .delete(`/subtasks/${subtaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteSubtaskResponse.status).toBe(204);
  });
});
