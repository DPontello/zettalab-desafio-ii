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
});
