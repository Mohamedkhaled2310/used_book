const Book = require('../models/Book');
const User = require('../models/User');

exports.uploadBook = async (req, res) => {
  const { title, author, price, status, description } = req.body;
  const user = await User.findById(req.userId);

  const newBook = new Book({
    user: user._id,
    title,
    author,
    price,
    status,
    description,
    image: req.file?.path,
    location: {
      type: 'Point',
      coordinates: user.location.coordinates,
    }
  });

  await newBook.save();
  res.status(201).json({ message: 'Book uploaded' });
};

exports.getNearbyBooks = async (req, res) => {
  const user = await User.findById(req.userId);

  const books = await Book.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: user.location.coordinates
        },
        $maxDistance: 20000 // 20km
      }
    }
  }).populate('user', 'name image');

  res.json(books);
};
