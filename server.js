const { createApp } = require("./src/app");
const { PORT } = require("./src/config/env");

const server = createApp();

server.listen(PORT, () => {
  console.log(`Attendance tracker running at http://localhost:${PORT}`);
});
