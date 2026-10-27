import { Injectable } from '@angular/core';

export interface ColumnaReporte<T> {
  encabezado: string;

  valor: (fila: T) => string | number | null | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ExportarReporte {

  exportarCsv<T>(
    nombreArchivo: string,
    columnas: ColumnaReporte<T>[],
    filas: T[]
  ): void {

    const encabezados = columnas.map(
      (columna) => this.escaparCsv(columna.encabezado)
    );

    const lineas = filas.map((fila) =>
      columnas
        .map((columna) => this.escaparCsv(columna.valor(fila) ?? ''))
        .join(',')
    );

    const contenido = [
      encabezados.join(','),
      ...lineas
    ].join('\r\n');

    // BOM UTF-8 para que Excel reconozca tildes y ñ correctamente
    const blob = new Blob(
      ['﻿' + contenido],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url = URL.createObjectURL(blob);

    const enlace = document.createElement('a');

    enlace.href = url;

    enlace.download = `${nombreArchivo}.csv`;

    enlace.click();

    URL.revokeObjectURL(url);

  }

  exportarPdf<T>(
    titulo: string,
    descripcionFiltros: string,
    columnas: ColumnaReporte<T>[],
    filas: T[]
  ): void {

    const ventana = window.open('', '_blank');

    if (!ventana) {

      alert(
        'El navegador bloqueó la ventana de impresión. ' +
        'Habilite las ventanas emergentes para exportar a PDF.'
      );

      return;

    }

    const filasHtml = filas
      .map((fila) => `
        <tr>
          ${
            columnas
              .map((columna) => `<td>${columna.valor(fila) ?? ''}</td>`)
              .join('')
          }
        </tr>
      `)
      .join('');

    const encabezadosHtml = columnas
      .map((columna) => `<th>${columna.encabezado}</th>`)
      .join('');

    ventana.document.write(`
      <html>
        <head>
          <title>${titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            p { color: #555; margin-top: 0; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>${titulo}</h1>
          <p>${descripcionFiltros} — Generado el ${new Date().toLocaleString('es-CR')}</p>
          <table>
            <thead>
              <tr>${encabezadosHtml}</tr>
            </thead>
            <tbody>${filasHtml}</tbody>
          </table>
        </body>
      </html>
    `);

    ventana.document.close();

    ventana.focus();

    ventana.print();

  }

  private escaparCsv(valor: string | number): string {

    const texto = String(valor);

    if (
      texto.includes(',') ||
      texto.includes('"') ||
      texto.includes('\n')
    ) {

      return `"${texto.replace(/"/g, '""')}"`;

    }

    return texto;

  }
}
