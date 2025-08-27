const PDFDocument = require('pdfkit');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const path = require('path');

exports.generateShopReport = async (req, res) => {
  try {
    // Accept all report fields from the request body
    const {
      shopName,
      reportDate,
      preparedBy,
      overviewStatus,
      overviewHighlight,
      overviewChallenge,
      cashSales,
      cardSales,
      airtimeSales,
      numTransactions,
      cashCountEnd,
      fastMovingItems,
      restockItems,
      slowExpiredItems,
      inventoryNotes,
      feedbackPositive,
      feedbackSuggestions,
      actionItems,
      signatureName
    } = req.body;

    const doc = new PDFDocument({ margin: 40 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=shop_report.pdf');
      res.send(pdfData);
    });

    doc.rect(40, doc.y, doc.page.width - 80, 32).fill('#27ae60');
    doc.fillColor('#fff').fontSize(22).font('Helvetica-Bold').text('SHOP REPORT', 40, doc.y - 28, { align: 'center', width: doc.page.width - 80 });
    doc.moveDown(1.5);
    doc.fillColor('#1a2236').fontSize(13).font('Helvetica').text(`Shop Name/Location: ${shopName || ''}`);
    doc.text(`Date of Report: ${reportDate || ''}`);
    doc.text(`Report Prepared By: ${preparedBy || ''}`);
    doc.moveDown();
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke('#e9eef3');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a2236').text('Summary', { underline: true });

    let income = 0, expense = 0, profit = 0;
    if (req.body.sales && req.body.products) {
      req.body.sales.forEach(sale => {
        if (sale.SaleItems) {
          sale.SaleItems.forEach(item => {
            const product = req.body.products.find(p => p.id === item.productId);
            if (product) {
              expense += (product.costPrice || 0) * item.quantity;
              income += (product.price || 0) * item.quantity;
            }
          });
        }
      });
      profit = income - expense;
    }
    doc.font('Helvetica').fillColor('#28304a');
    doc.text(`Total Income: R${income.toFixed(2)}`);
    doc.text(`Total Expense: R${expense.toFixed(2)}`);
    doc.text(`Total Profit: R${profit.toFixed(2)}`);
    doc.moveDown();

    // --- 1. Daily/Shift Overview ---
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#27ae60').text('1. Daily/Shift Overview');
    doc.fontSize(12).font('Helvetica').fillColor('#1a2236').text(`Overall Status: `, { continued: true }).font('Helvetica-Bold').text(overviewStatus || '', { continued: false });
    doc.font('Helvetica').text(`Key Highlight: `, { continued: true }).font('Helvetica-Bold').text(overviewHighlight || '', { continued: false });
    doc.font('Helvetica').text(`Main Challenge: `, { continued: true }).font('Helvetica-Bold').text(overviewChallenge || '', { continued: false });
    doc.moveDown();

    // --- 2. Sales & Cash Flow Summary ---
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#27ae60').text('2. Sales & Cash Flow Summary');
    doc.moveDown(0.2);
    // Table header
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a2236');
    doc.text('Metric', 50, doc.y, { width: 200, continued: true });
    doc.text('Value', 250, doc.y, { width: 100, align: 'right', continued: true });
    doc.text(' ', 350, doc.y, { width: 100 });
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e9eef3');
    doc.moveDown(0.2);
    doc.font('Helvetica').fillColor('#28304a');
    doc.text('Total Cash Sales', 50, doc.y, { width: 200, continued: true });
    doc.text(`R${cashSales || '0.00'}`, 250, doc.y, { width: 100, align: 'right', continued: true });
    doc.text(' ', 350, doc.y, { width: 100 });
    doc.text('Total Card/Digital Sales', 50, doc.y, { width: 200, continued: true });
    doc.text(`R${cardSales || '0.00'}`, 250, doc.y, { width: 100, align: 'right', continued: true });
    doc.text(' ', 350, doc.y, { width: 100 });
    doc.text('Airtime/Electricity Sales', 50, doc.y, { width: 200, continued: true });
    doc.text(`R${airtimeSales || '0.00'}`, 250, doc.y, { width: 100, align: 'right', continued: true });
    doc.text(' ', 350, doc.y, { width: 100 });
    doc.text('Number of Transactions', 50, doc.y, { width: 200, continued: true });
    doc.text(`${numTransactions || '0'}`, 250, doc.y, { width: 100, align: 'right', continued: true });
    doc.text(' ', 350, doc.y, { width: 100 });
    doc.text('Cash Count at End of Day', 50, doc.y, { width: 200, continued: true });
    doc.text(`R${cashCountEnd || '0.00'}`, 250, doc.y, { width: 100, align: 'right', continued: true });
    doc.text(' ', 350, doc.y, { width: 100 });
    doc.moveDown();

    // --- Top 5 Products Sold ---
    if (req.body.sales && req.body.products) {
      const productSales = {};
      req.body.sales.forEach(sale => {
        if (sale.SaleItems) {
          sale.SaleItems.forEach(item => {
            if (!productSales[item.productId]) productSales[item.productId] = 0;
            productSales[item.productId] += item.quantity;
          });
        }
      });
      const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([productId, qty]) => {
          const prod = req.body.products.find(p => p.id === parseInt(productId));
          return { name: prod ? prod.name : 'Unknown', qty };
        });
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a2236').text('Top 5 Products Sold', { underline: true });
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a2236').text('Product', 60, doc.y, { width: 200, continued: true });
      doc.text('Qty', 260, doc.y, { width: 60 });
      let row = 0;
      topProducts.forEach(item => {
        doc.rect(60, doc.y, 260, 18).fill(row % 2 === 0 ? '#f4f7fa' : '#fff');
        doc.fillColor('#28304a').font('Helvetica').text(item.name, 60, doc.y + 2, { width: 200, continued: true });
        doc.text(item.qty.toString(), 260, doc.y + 2, { width: 60 });
        row++;
      });
      doc.moveDown();
    }

    // --- 3. Inventory & Stock Levels ---
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#27ae60').text('3. Inventory & Stock Levels');
    doc.moveDown(0.2);
    // Fast-Moving Items Table
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a2236').text('Fast-Moving Items (Low Stock):');
    if (fastMovingItems && fastMovingItems.length > 0 && fastMovingItems[0].name) {
      doc.font('Helvetica').fillColor('#28304a');
      doc.text('Product', 60, doc.y, { width: 200, continued: true });
      doc.text('Qty', 260, doc.y, { width: 60 });
      fastMovingItems.forEach(item => {
        doc.text(item.name, 60, doc.y, { width: 200, continued: true });
        doc.text(item.qty.toString(), 260, doc.y, { width: 60 });
      });
    } else {
      doc.font('Helvetica').fillColor('#888').text('None');
    }
    doc.moveDown(0.2);
    doc.font('Helvetica-Bold').fillColor('#1a2236').text('Items Needing Restock (Urgent):');
    if (restockItems && restockItems.length > 0 && restockItems[0]) {
      doc.font('Helvetica').fillColor('#e74c3c');
      restockItems.forEach(item => doc.text(`- ${item}`));
    } else {
      doc.font('Helvetica').fillColor('#888').text('None');
    }
    doc.moveDown(0.2);
    doc.font('Helvetica-Bold').fillColor('#1a2236').text('Slow-Moving/Expired Items Identified:');
    if (slowExpiredItems && slowExpiredItems.length > 0 && slowExpiredItems[0]) {
      doc.font('Helvetica').fillColor('#f39c12');
      slowExpiredItems.forEach(item => doc.text(`- ${item}`));
    } else {
      doc.font('Helvetica').fillColor('#888').text('None');
    }
    doc.moveDown(0.2);
    doc.font('Helvetica-Bold').fillColor('#1a2236').text('Inventory Notes:');
    doc.font('Helvetica').fillColor('#28304a').text(inventoryNotes || '');
    doc.moveDown();

    // --- 4. Customer & Community Feedback ---
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#27ae60').text('4. Customer & Community Feedback');
    doc.moveDown(0.2);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a2236').text('Positive Feedback:');
    if (feedbackPositive && feedbackPositive.length > 0 && feedbackPositive[0]) {
      doc.font('Helvetica').fillColor('#27ae60');
      feedbackPositive.forEach(item => doc.text(`- ${item}`));
    } else {
      doc.font('Helvetica').fillColor('#888').text('None');
    }
    doc.moveDown(0.2);
    doc.font('Helvetica-Bold').fillColor('#1a2236').text('Suggestions/Complaints:');
    if (feedbackSuggestions && feedbackSuggestions.length > 0 && feedbackSuggestions[0]) {
      doc.font('Helvetica').fillColor('#e67e22');
      feedbackSuggestions.forEach(item => doc.text(`- ${item}`));
    } else {
      doc.font('Helvetica').fillColor('#888').text('None');
    }
    doc.moveDown();

    // --- 5. Action Items & Next Steps ---
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#27ae60').text('5. Action Items & Next Steps');
    doc.moveDown(0.2);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a2236');
    doc.text('Task', 50, doc.y, { width: 200, continued: true });
    doc.text('Responsible', 250, doc.y, { width: 120, continued: true });
    doc.text('Deadline', 370, doc.y, { width: 100 });
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e9eef3');
    if (actionItems && actionItems.length > 0 && actionItems[0].task) {
      doc.font('Helvetica').fillColor('#28304a');
      actionItems.forEach(item => {
        doc.text(item.task, 50, doc.y, { width: 200, continued: true });
        doc.text(item.responsible, 250, doc.y, { width: 120, continued: true });
        doc.text(item.deadline, 370, doc.y, { width: 100 });
      });
    } else {
      doc.font('Helvetica').fillColor('#888').text('None', 50, doc.y);
    }
    doc.moveDown();

    // --- Signature ---
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a2236').text('Signature:', { continued: true });
    doc.font('Helvetica').fillColor('#28304a').text(` ${signatureName || ''} for this company`, { underline: true });
    doc.moveDown(2);

    // --- Footer ---
    doc.fontSize(10).font('Helvetica').fillColor('#888').text('Thank you for using our shop system!', 40, doc.page.height - 65, { align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#888').text(`Report generated on ${new Date().toLocaleString()}`, 40, doc.page.height - 50, { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
