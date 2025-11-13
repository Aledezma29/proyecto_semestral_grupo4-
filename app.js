document.addEventListener("DOMContentLoaded", () => {
  // ---- Manejo de navegación principal ----
  function mostrar(id) {
    ["bienvenida", "registroFacturas", "registroProveedores", "registroCategorias", "reportes"]
      .forEach(sec => document.getElementById(sec).style.display = "none");
    document.getElementById(id).style.display = "block";
  }

  // Menú navegación SPA
  document.getElementById("linkInicio").onclick = () => mostrar("bienvenida");
  document.getElementById("logoInicio").onclick = (e) => {
    e.preventDefault();
    mostrar("bienvenida");
  };
  document.getElementById("linkDocumentos").onclick = () => mostrar("registroFacturas");
document.getElementById("linkProveedores").onclick = () => mostrar("registroProveedores");
document.getElementById("linkCategorias").onclick = () => mostrar("registroCategorias");
document.getElementById("linkReportes").onclick = () => {
  mostrar("reportes");
  cargarProveedoresYReportes();
  inicializarReportesBotones();
};
  mostrar("bienvenida");

  // --- CRUD Proveedores ---
  let proveedoresGlobal = [];
  function cargarProveedores() {
    fetch("http://localhost:3000/proveedores")
      .then(r => r.json())
      .then(data => {
        proveedoresGlobal = data;
        // select del formulario factura
        let proveedorSelect = document.getElementById("proveedor");
        proveedorSelect.innerHTML = "";
        data.forEach(p => {
          let opt = document.createElement("option");
          opt.value = p.CodigoProveedor;
          opt.textContent = p.NombreProveedor;
          proveedorSelect.appendChild(opt);
        });
        // tabla con botón eliminar
        let html = `<table><tr><th>Código</th><th>Nombre</th><th>RUC</th><th>DV</th><th>Acciones</th></tr>`;
        data.forEach(p => {
          html += `<tr>
            <td>${p.CodigoProveedor}</td>
            <td>${p.NombreProveedor}</td>
            <td>${p.RUC || ""}</td>
            <td>${p.DigitoVerificador || ""}</td>
            <td>
              <button onclick="eliminarProveedor('${p.CodigoProveedor}')">Eliminar</button>
            </td>
          </tr>`;
        });
        html += "</table>";
        document.getElementById("tablaProveedores").innerHTML = html;
      });
  }
  window.eliminarProveedor = function(id) {
    if (confirm("¿Eliminar proveedor?")) {
      fetch(`http://localhost:3000/proveedores/${id}`, {method:"DELETE"})
        .then(() => cargarProveedores());
    }
  };
  document.getElementById("proveedorForm").onsubmit = function(e) {
    e.preventDefault();
    let body = {
      CodigoProveedor: e.target.codigoProveedor.value.trim(),
      NombreProveedor: e.target.nombreProveedor.value.trim(),
      RUC: e.target.ruc.value.trim(),
      DigitoVerificador: e.target.digitoVerificador.value.trim()
    };
    fetch("http://localhost:3000/proveedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(() => {
      e.target.reset();
      cargarProveedores();
    });
  };

  // --- CRUD Categorías ---
  function cargarCategorias() {
    fetch("http://localhost:3000/categorias")
      .then(r => r.json())
      .then(data => {
        let categoriaSelect = document.getElementById("categoria");
        categoriaSelect.innerHTML = "";
        data.forEach(c => {
          let opt = document.createElement("option");
          opt.value = c.Categoria;
          opt.textContent = c.Categoria;
          categoriaSelect.appendChild(opt);
        });
        let html = `<table><tr><th>Categoría</th><th>Descripción</th><th>Acciones</th></tr>`;
        data.forEach(c => {
          html += `<tr>
            <td>${c.Categoria}</td>
            <td>${c.Descripcion}</td>
            <td>
              <button onclick="eliminarCategoria('${c.Categoria}')">Eliminar</button>
            </td>
          </tr>`;
        });
        html += "</table>";
        document.getElementById("tablaCategorias").innerHTML = html;
      });
  }
  window.eliminarCategoria = function(cat) {
    if (confirm("¿Eliminar categoría?")) {
      fetch(`http://localhost:3000/categorias/${cat}`, {method:"DELETE"}).then(() => cargarCategorias());
    }
  };
  document.getElementById("categoriaForm").onsubmit = function(e) {
    e.preventDefault();
    let body = {
      Categoria: e.target.categoriaNueva.value.trim(),
      Descripcion: e.target.descripcion.value.trim()
    };
    fetch("http://localhost:3000/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(() => {
      e.target.reset();
      cargarCategorias();
    });
  };

  // --- CRUD Facturas ---
  function cargarFacturas() {
    fetch("http://localhost:3000/facturas")
      .then(r => r.json())
      .then(data => {
        let html = `<table>
        <tr>
          <th>Número</th><th>Fecha</th><th>Proveedor</th><th>Categoría</th>
          <th>Subtotal</th><th>ITBMS</th><th>Total</th><th>Acciones</th>
        </tr>`;
        data.forEach(f => {
          html += `<tr>
            <td>${f.NumeroFactura}</td>
            <td>${f.FechaFactura}</td>
            <td>${f.CodigoProveedor}</td>
            <td>${f.Categoria}</td>
            <td>${f.Subtotal}</td>
            <td>${f.ITBMS}</td>
            <td>${f.Total}</td>
            <td>
              <button onclick="eliminarFactura('${f.NumeroFactura}')">Eliminar</button>
            </td>
          </tr>`;
        });
        html += "</table>";
        document.getElementById("tablaFacturas").innerHTML = html;
      });
  }
  window.eliminarFactura = function (num) {
    if (confirm("¿Eliminar factura?")) {
      fetch(`http://localhost:3000/facturas/${num}`, {method:"DELETE"}).then(() => cargarFacturas());
    }
  };
  document.getElementById("subtotal").oninput =
    document.getElementById("itbms").oninput = function () {
      let sub = parseFloat(document.getElementById("subtotal").value) || 0;
      let it = parseFloat(document.getElementById("itbms").value) || 0;
      document.getElementById("total").value = (sub + it).toFixed(2);
    };
  document.getElementById("facturaForm").onsubmit = function (e) {
    e.preventDefault();
    let body = {
      NumeroFactura: e.target.numeroFactura.value.trim(),
      FechaFactura: e.target.fechaFactura.value,
      CodigoProveedor: e.target.proveedor.value,
      Categoria: e.target.categoria.value,
      Subtotal: parseFloat(e.target.subtotal.value),
      ITBMS: parseFloat(e.target.itbms.value),
      Total: parseFloat(e.target.total.value)
    };
    fetch("http://localhost:3000/facturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(() => {
      e.target.reset();
      document.getElementById("total").value = "";
      cargarFacturas();
    });
  };

  // --- REPORTES con filtro y exportación ---
  let facturasGlobal = [];

  function formatFecha(fecha) {
    let d = new Date(fecha);
    return isNaN(d) ? fecha : d.toLocaleDateString('es-PA');
  }
  function nombreProveedorPorCodigo(cod) {
    let p = proveedoresGlobal.find(x => x.CodigoProveedor === cod);
    return p ? p.NombreProveedor : cod;
  }
  function renderReportesTable(lista) {
    let html = `<table>
      <tr>
        <th>Fecha</th>
        <th>Nº Factura</th>
        <th>Proveedor</th>
        <th>Tipo</th>
        <th>Subtotal</th>
        <th>ITBMS</th>
        <th>Total</th>
      </tr>`;
    let totalSum = 0, subSum = 0, itbmsSum = 0;
    lista.forEach(f => {
      html += `<tr>
        <td>${formatFecha(f.FechaFactura)}</td>
        <td>${f.NumeroFactura}</td>
        <td>${nombreProveedorPorCodigo(f.CodigoProveedor)}</td>
        <td>${f.Categoria}</td>
        <td>${Number(f.Subtotal).toFixed(2)}</td>
        <td>${Number(f.ITBMS).toFixed(2)}</td>
        <td>${Number(f.Total).toFixed(2)}</td>
      </tr>`;
      subSum += Number(f.Subtotal);
      itbmsSum += Number(f.ITBMS);
      totalSum += Number(f.Total);
    });
    html += "</table>";
    document.getElementById("tablaReportes").innerHTML = html;
    document.getElementById("sumaTotales").textContent =
      `SUMATORIA — Subtotal: ${subSum.toFixed(2)} | ITBMS: ${itbmsSum.toFixed(2)} | Total: ${totalSum.toFixed(2)}`;
  }
  function cargarProveedoresYReportes() {
    fetch("http://localhost:3000/proveedores")
      .then(r => r.json())
      .then(data => {
        proveedoresGlobal = data;
        cargarFacturasReportes();
      });
  }
  function cargarFacturasReportes() {
    fetch("http://localhost:3000/facturas")
      .then(r => r.json())
      .then(data => {
        facturasGlobal = data;
        renderReportesTable(data);
      });
  }

  // Esta función asegura que los botones existen antes de asignar onClick
  function inicializarReportesBotones() {
    const btnFiltrar = document.getElementById("btnFiltrar");
    const btnLimpiarFiltro = document.getElementById("btnLimpiarFiltro");
    const btnExportarCSV = document.getElementById("btnExportarCSV");
    if (!btnFiltrar || !btnLimpiarFiltro || !btnExportarCSV) return;

    btnFiltrar.onclick = function() {
      const fechaFiltro = document.getElementById("filtroFecha").value;
      if (!fechaFiltro) return renderReportesTable(facturasGlobal);
      renderReportesTable(facturasGlobal.filter(f =>
        f.FechaFactura && f.FechaFactura.startsWith(fechaFiltro)
      ));
    };
    btnLimpiarFiltro.onclick = function() {
      document.getElementById("filtroFecha").value = "";
      renderReportesTable(facturasGlobal);
    };
    btnExportarCSV.onclick = function() {
      let csv = "Fecha,Nº Factura,Proveedor,Tipo,Subtotal,ITBMS,Total\n";
      facturasGlobal.forEach(f => {
        csv += `"${formatFecha(f.FechaFactura)}","${f.NumeroFactura}","${nombreProveedorPorCodigo(f.CodigoProveedor)}","${f.Categoria}",${f.Subtotal},${f.ITBMS},${f.Total}\n`;
      });
      const blob = new Blob([csv], {type:'text/csv'});
      const url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = "reporte_facturas.csv";
      a.click();
    };
  }

  // Inicializa todo al cargar la page (pantallas normales)
  cargarProveedores();
  cargarCategorias();
  cargarFacturas();
});
