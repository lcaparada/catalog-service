import fastify from "fastify";

function bootstrap() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  });
  return app;
}

const start = async () => {
  const app = bootstrap();
  try {
    await app.listen({
      port: 3001,
    });
    app.log.info(`Server is running on 3001 🔥`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
