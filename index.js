const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const app = express();


const sequelize = new Sequelize({
  storage: 'films.db',
  dialect: 'sqlite',
});

app.use(express.static('public'))

const Film = sequelize.define('film', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING(200),
  },
  year: {
    type: Sequelize.INTEGER,
  },
  directorId: {
    type: Sequelize.INTEGER,
  },
});

const Director = sequelize.define('director', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(200),
  },
});

const Actor = sequelize.define('actor', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(200),
  },
});

const FilmActor = sequelize.define('film_actor', {
  filmId: {
    type: Sequelize.INTEGER,
  },
});


Film.belongsTo(Director, { foreignKey: 'directorId' });
Director.hasMany(Film, { foreignKey: 'directorId' });
FilmActor.belongsTo(Film, { foreignKey: 'filmId' });

sequelize.sync().then((result) => {
  console.log('DB is connected!');
});

app.use(express.json());

app.post('/films', async (req, res) => {
  const { title, year, directorId } = req.body;
  const film = await Film.create({
    title,
    year,
    directorId,
  });

  const films = await Film.findAll({
    include: [
      {
        model: Director,
      },
    ],
  });
});

app.get('/films', async (req, res) => {
  const films = await Film.findAll({
    include: [
      {
        model: Director,
      },
    ],
  });

});

app.get('/films/:id', async (req, res) => {
  try {
    const id = req.params.id;
  const film = await Film.findByPk(id);
  if (film) {
    return res.json(film);
  }
  res.statusCode = 404;
  res.json({
    error: 'no such film',
  }).end();
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
});

app.delete('/films/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const film = await Film.findByPk(id);
    if (!film) {
      return res.status(404).json({
        status: 404,
        message: 'Film not found',
      });
    }
    await film.destroy();
    const films = await Film.findAll({
      include: [
        {
          model: Director,
        },
      ],
    });
  
  return res.render('films.hbs', {films})
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
});

app.put('/films/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const film = await Film.findByPk(id);
    if (!film) {
      return res.status(404).json({
        status: 404,
        message: 'Film not found',
      });
    }
    const { title, year } = req.body;
    await film.update({
      title,
      year,
    });
    return res.status(200).json(film);
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
});


app.post('/directors', async (req, res) => {
    const { name } = req.body;
    const director = await Director.create({ name });
    const directors = await Director.findAll({
      include: [
        {
          model: Film,
        },
      ],
  });
  
});
  
app.get('/directors', async (req, res) => {
    const directors = await Director.findAll({
      include: [
        {
          model: Film,
        },
      ],
  });
  });
  
  app.get('/directors/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const director = await Director.findByPk(id);
      if(!director){
        return res.status(404).json({
          status: 404,
          message: 'Director not found',
        });
      }
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
    
  });

  app.delete('/directors/:id', async (req, res) => {
    try {
      const id = req.params.id; 
      const director=await Director.findByPk(id);
      if (!director) {
        return res.status(404).json({
          status: 404,
          message: 'Director not found',
        });
      };

      await Film.destroy({
        where: {
          directorId: id,
        },
      });
      await Director.destroy({
        where: {
          id,
        },
      });
      return res.status(200).json({
        message: 'ok',
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
    
  });
  
  app.put('/directors/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const director = await Director.findByPk(id);
      if (!director) {
        return res.status(404).json({
          status: 404,
          message: 'Director not found',
        });
      }
      const { name } = req.body;
      await director.update({
        name
      });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  });
 
  app.get('/actors/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const actor = await Actor.findByPk(id);
      if(!actor){
        return res.status(404).json({
          status: 404,
          message: 'Actor not found',
        });
      }
      const actors = await Actor.findAll({ raw: true });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
    
  });

  app.delete('/actors/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const actor = await Actor.findByPk(id);
      if (!actor) {
        return res.status(404).json({
          status: 404,
          message: 'Actor not found',
        });
      }
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
    
  });

  app.put('/actors/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const actor = await Actor.findByPk(id);
      if (!actor) {
        return res.status(404).json({
          status: 404,
          message: 'Actor not found',
        });
      }

    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  });
  app.listen(3000, () => {
    console.log('Server is started!');
  });