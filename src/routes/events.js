import passport from 'passport';
import Event from '../db/models/Event';

export default app => {
  app.post('/api/event/update', async (req, res) => {
    if (!req.isAuthenticated() || (req.isAuthenticated() && req.user.role !== 'admin')) {
      return res.send({ code: 401, data: null });
    }
    const { body } = req;
    console.log(body, Object.keys(body).join(' '), Object.keys(body).join(' ').includes(['title', 'date']));
    if (body._id) {
      const event = await Event.findById(body._id);
      if (!event) return res.send({ code: 404 });
      await Event.update({ _id: body._id }, body, {
        upsert: true,
        setDefaultsOnInsert: true
      });
      return res.send({ code: 200, data: null });
    }
    if (body.hasOwnProperty('title') && body.hasOwnProperty('date')) {
      const newEvent = await Event.create({
        title: body.title,
        date: body.date,
      });
      return res.send({ code: 200, data: newEvent });
    }
  });
};
