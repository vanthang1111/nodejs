const db = require("../models/index");

const storeProduct = async (req, res) => {
  try {
    if (
      req.body.name == "" ||
      req.body.image == "" ||
      req.body.price == "" ||
      req.body.description == "" ||
      req.body.SizeId == ""

    ) {
      return res.json({
        success: false,
        message: "Vui lòng thêm đầy đủ thông tin sản phẩm",
      });
    } else {
      let name = req.body.name;
      let price = req.body.price;
      let image = req.body.image;
      let description = req.body.description;
      let SizeId = req.body.SizeId;
      let product = await db.Product.create({
        name: name,
        image: image,
        description: description
      });
      if (product) {
        let price_add = await db.Price.create({
          SizeId: SizeId,
          ProductId: product.id,
          price: price,
        });
        return res.json({
          success: true,
          message: "Thêm sản phẩm thành công",
          product: product,
          price: price_add,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const indexProduct = async (req, res) => {
  try {
    const page = req.params.page;
    if (page <= 0) {
      return res.json({
        success: false,
        message: `Không tìm thấy sản phẩm`,
      });
    }
    const product_page = 2;

    let { count, rows } = await db.Product.findAndCountAll({
      offset: (page - 1) * product_page,
      limit: product_page,
      include: [
        {
          model: db.Price,
          attributes: ["price"],
        },
      ],
    });
    const totalPages = Math.ceil(count / product_page);
    if (page == "" || page > totalPages) {
      return res.json({
        success: false,
        message: `Không tìm thấy sản phẩm`,
      });
    }
    return res.json({
      success: true,
      product: rows,
      countPage: totalPages,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let description = req.body.description;
    let SizeId = req.body.SizeId;
    let PriceId = req.body.PriceId;
    let getproduct = await db.Product.findOne({ where: { id: id } });
    if (!getproduct) {
      return res.json({
        success: false,
        message: "Không tìm thấy sản phẩm cần sửa !",
      });
    } else {
      await db.Product.update({
        name: name,
        image: image,
        description: description
      }, {
        where: { id: id }
      })
      await db.Price.update(
        {
          SizeId: SizeId,
          price: price
        },
        { where: { id: PriceId, ProductId: id } }
      );
      return res.json({
        success: true,
        message: "Sửa sản phẩm thành công !",
      });
    }
  } catch (error) {
    console.log(error)
  }

};

const deleteProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let getproduct = await db.Product.findOne({ where: { id: id } });
    let PriceId = req.body.PriceId;
    if (!getproduct) {
      return res.json({
        success: false,
        message: "Không tìm thấy sản phẩm cần xóa !",
      });
    } else {
      await db.Price.destroy({
        where: {
          id: PriceId,
          ProductId: id,
        },
      });
      await db.Product.destroy({
        where: {
          id: id,
        },
      });
      return res.json({
        success: true,
        message: "Xóa sản phẩm thành công!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const showProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await db.Product.findOne({
      where: { id: id },
    });
    let price = await db.Price.findAll({
      where: { ProductId: id },
    });
    if (!product) {
      return res.json({
        success: false,
        message: `Không có sản phẩm id= ${id}!`,
      });
    }
    return res.json({
      success: true,
      message: "Chi tiết sản phẩm",
      product: product,
      price: price
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  storeProduct,
  updateProduct,
  deleteProduct,
  showProduct,
  indexProduct,
};
