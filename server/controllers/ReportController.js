const PDFDocument = require('pdfkit');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

exports.generateShopReport = async (req, res) => {
  try {
    const products = await Product.findAll();
    const sales = await Sale.findAll();

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=shop_report.pdf');
      res.send(pdfData);
    });

    doc.fontSize(18).text('Shop Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text('Inventory:', { underline: true });
    products.forEach(p => {
      doc.fontSize(10).text(`Name: ${p.name} | Category: ${p.category} | Price: R${p.price} | Barcode: ${p.barcode || '-'} | Quantity: ${p.quantity}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Sales:', { underline: true });
    sales.forEach(s => {
      doc.fontSize(10).text(`Product ID: ${s.productId} | Quantity: ${s.quantity} | Total: R${s.total} | Date: ${s.date.toISOString().slice(0,10)}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
