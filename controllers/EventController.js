import * as Events from '../services/Events.js';
import express from 'express';
import { authorize } from '../services/security.js';
const router = express.Router();

router.get('/', (req, res) => {
  let allEvents = Events.allEvents();
  res.render('index.twig', allEvents);
});
router.get('/delete/:event_id', authorize(), async function (req, res) {
  await Events.deletePost(req.params.event_id);

  res.redirect('/');
});
export {router as EventController}