import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarBoleta = (venta) => {
  const doc = new jsPDF();

  // --- 1. ENCABEZADO Y LOGO ---
  // Fondo del encabezado (Color Chocolate)
  doc.setFillColor(139, 69, 19); 
  doc.rect(0, 0, 210, 40, 'F');

  // Título de la Empresa (Blanco)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Pastelería Mil Sabores", 15, 20);

  // Subtítulo
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Tradición y Dulzura desde 1973", 15, 28);

  // --- 2. DATOS DE LA BOLETA (Lado Derecho) ---
  doc.setFontSize(10);
  doc.text("RUT: 76.123.456-K", 160, 15);
  doc.text("Boleta Electrónica", 160, 20);
  doc.setFontSize(14);
  doc.text(`Nº ${venta.id.toString().padStart(6, '0')}`, 160, 28);

  // --- 3. INFORMACIÓN DEL CLIENTE ---
  doc.setTextColor(0, 0, 0); // Volvemos a negro
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Detalles del Cliente:", 15, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nombre: ${venta.nombreUsuario}`, 15, 62);
  
  // Formateamos la fecha
  const fechaCompra = new Date(venta.fecha).toLocaleDateString();
  const fechaEntrega = venta.fechaEntrega || "Por definir";
  
  doc.text(`Fecha Compra: ${fechaCompra}`, 15, 68);
  doc.text(`Fecha Entrega: ${fechaEntrega}`, 15, 74);
  doc.text(`Estado: ${venta.estado}`, 15, 80);

  // --- 4. TABLA DE PRODUCTOS ---
  // Como guardamos el detalle en texto plano, vamos a "parsearlo" para la tabla
  // El formato guardado es: "- Nombre Torta ($Precio)"
  const filas = venta.detalleCompra.split('\n').map(item => {
    // Limpiamos el string para separar nombre y precio
    const nombre = item.replace('-', '').split('($')[0].trim();
    const precio = item.split('($')[1]?.replace(')', '') || '0';
    return [nombre, `$${precio}`];
  });

  autoTable(doc, {
    startY: 90,
    head: [['Descripción del Producto', 'Valor']],
    body: filas,
    theme: 'grid',
    headStyles: { fillColor: [139, 69, 19] }, // Cabecera color chocolate
    styles: { fontSize: 10 },
  });

  // --- 5. TOTALES ---
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL PAGADO:`, 140, finalY);
  
  doc.setFontSize(14);
  doc.setTextColor(139, 69, 19); // Color chocolate para el precio
  doc.text(`$${venta.totalPagado}`, 180, finalY, { align: 'right' });

  // --- 6. PIE DE PÁGINA ---
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("¡Gracias por preferirnos! Visítanos en www.milsabores.cl", 105, 280, { align: 'center' });

  // --- GUARDAR ---
  doc.save(`Boleta_MilSabores_${venta.id}.pdf`);
};