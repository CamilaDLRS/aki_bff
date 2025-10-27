import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const router = express.Router();
const swaggerDocument = YAML.load(path.join(__dirname, '../../bff.yaml'));

router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
