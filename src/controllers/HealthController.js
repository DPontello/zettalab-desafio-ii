class HealthController {
  index(req, res) {
    return res.json({
      status: "ok",
      time: new Date().toISOString()
    });
  }
}

module.exports = new HealthController();
