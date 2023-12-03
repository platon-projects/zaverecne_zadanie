import * as Events from '../services/Events';
import express from 'express';
const router = express.Router();

router.get('/',(req,res)=>{
   let allEvents = Events.allEvents();
   res.render('index.twig', allEvents);
});