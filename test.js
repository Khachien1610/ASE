const Student = require("./src/app/models/Student");
const { mongooseToOject, multipleMongooseToObject } = require("./src/ulti/mongoose");


tenPromise
    .save() // Lưu
    .then() // Thành công
    .catch() // Lỗi


// var student = new Student();
var students = await Student.find({ name: 'Tuấn' }); // Lấy objects từ DB ra
var student = await Student.findOne({ _id: '123', name: 'Tuấn' }); // Lấy 1 object từ DB ra
await Student.updateOne();

students = multipleMongooseToObject(students); // classes => objects

student = mongooseToOject(student); // class => object





// Tạo trang nhập thông tin và lấy thông tin để lưu vào DB
// 0. Vào model tạo 1 đối tượng muốn lưu vào DB
// 1. Tạo router GET để render ra trang nhập thông tin(render file handlebar) => router.get
// 2. Tạo file handlebar(nhớ để ý method và action của FORM) => fileName.hbs
// 3. Tạo router POST để lấy thông tin vừa nhập về => router.post
// 4. Khởi tạo 1 đối tượng bạn muốn lưu vào DB(nhớ require file)   => new 
// 5. Lưu đối tượng => save()
// 6. Chuyển hướng trang web => res.redirect