import app from './app';
import { seedAdmin } from './config/seedAdmin';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function bootstrap() {
  try {
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void bootstrap();