const express = require('express');
const router = express.Router();
const { uuid: uuidv4 } = require("uuid");

//instantiate mongodb 
const { db } = require('../mongo');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const blogs = await db()
  .collection('sample_blogs')

  .find({})
  .limit(100)
  .toArray(function(err, result){
      if (err) {
        res.status(400).send("error fetching blogs")
      } else {
        res.json(result); 
      }
    }); 

    res.json({
      sucess:true,
      blogs: blogs
    });

    
}); 

router.get('/single-blog/:titleToGet', async function(req, res, next){
  const blogs = await db()
  .collection('sample_blogs')
  
  const titleToGet = req.params.titleToGet
  const query = {title: titleToGet};
  const singleBlog = await blogs.findOne(query);
  // const singleBlog = await blogs.findOne({title:`${titleToGet}`})

  res.json({
    sucess:true,
    blogs: singleBlog
  });

});



router.post('/update-one/:titleToGet', async function(req, res, next){
  
  const titleToGet = req.params.titleToGet
  const newTitle = req.body.title
  const newAuthor = req.body.author
  const newText = req.body.text
  const filter = {title: titleToGet};
  const updateDoc = { $set: {
    title: newTitle,
    author: newAuthor,
    text: newText,
    categories: [] }
  };

  const updatedBlog = await db()
  .collection('sample_blogs')
  .updateOne(filter, updateDoc);

  
  res.json({
    sucess:true, 
    message: "Update successful"
    // blogs: updatedBlog
  });

});


router.get('/get-one/:id', async function(req, res, next){

  
  const blogs = await db()
  .collection('sample_blogs')

  try{
  const idGet = req.params.id
  const query = {objectId: idGet};
  const singleBlogID = await blogs.findOne(query);
  // const singleBlog = await blogs.findOne({title:`${titleToGet}`})
  if (singleBlogID === null || singleBlogID === undefined){
    throw `ERROR: Unable to find blog: Title is ${singleBlogID}` ;
  } 

  res.json({
    sucess:true,
    blog: singleBlogID
    });
  }
  catch (e){
    res.json ({
      success: false,
      message: `${e}`
    })
  }
});

router.post('/create-one-blog', async function(req, res, next){

try {
  
  const doc = {

    createdAt: new Date(),
    title: req.body.title,
    author: req.body.author,
    text: req.body.text, 
    lastModified: new Date(),
    categories:req.body.category}
  ;

  const updatedBlog = await db()
  .collection('sample_blogs')
  .insertOne(doc);

  
  res.json({
    sucess:true, 
    message: "Insert successful!"
    // blogs: updatedBlog
    });
  }

  catch {
    res.json ({
      success: false,
      message: "Insert unsuccessful!"
    })
  }
});

router.post('/create-multiple', async function createMultiple(client, newBlogs){
  const blogs = await db()
  .collection('sample_blogs')
  .insertMany(newBlogs)

  console.log(`${blogs.insertedCount} new blog(s) created with the following id(s):`)
  console.log(newBlogs.insertedIds)
  
})




router.get('/get-multiple', async function(req, res, next){
  const blogs = await db()
  .collection('sample_blogs')
  .find(
    {
      // categories: 'Lorem', 
      categories: ['quia','ea','et']
    }
  ).sort({ lastModified: -1 })

  .toArray(function(err, result){
    if (err) {
      res.status(400).send("error fetching blogs")
    } else {
      res.json(result); 
    }
  }); 

  res.json({
    sucess:true,
    blogs: blogs
  });

});

router.delete('/delete-one/:titleToGet', async function(req, res, next){
  const blogs = await db()
  .collection('sample_blogs')
  
  const titleToGet = req.params.titleToGet
  const query = {title: titleToGet};
  const deletedBlog = await blogs.deleteOne(query);
  console.log(`${query.deletedCount} document(s) was/were deleted.`)

  res.json({
    sucess:true,
    message: "Deletion successful"
  });
});

router.delete('/delete-multiple', async function(req, res, next){
  const blogs = await db()
  .collection('sample_blogs')
  .deleteMany({ 'author': {$eq: "Ronnie James Dio"} })
  console.log(`${blogs.deletedCount} documents) were deleted.`)

  res.json({
    sucess:true,
    message: "Deletion successful"
  });
});
module.exports = router;
