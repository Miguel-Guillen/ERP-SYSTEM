import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserAuth } from 'src/app/core/models/auth';
import { reportNomina } from 'src/app/core/models/reports';
import { TypeDocument, typeDocument } from '../../../core/enums/reports.enum';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  user = new UserAuth();
  form = new FormGroup({});
  nominaFormat = new reportNomina()

  formValid = true;
  send = false;
  
  formats = TypeDocument;
  format = TypeDocument.Select;
  typeFormat = typeDocument;

  fecha: any

  concepto = {
    con1: 100.00,
    con2: 200.00,
    con3: 50.00,
    con4: 80.00
  }

  gravado = {
    gra1: 80.00,
    gra2: 50.00,
    gra3: 100.00,
    gra4: 70.00,
    gra5: 80.00
  }

  vales = 358.00

  constructor(private formB: FormBuilder, private toast: ToastrService) {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    if(day <= 9) this.fecha = `${year}/${month}/0${day}`;
    else this.fecha = `${year}/${month}/${day}`;
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('data') || '{}');
  }
  
  selectFormat(value: string){
    if(value == TypeDocument.Nomina){ 
      this.format = TypeDocument.Nomina;
      this.form = this.createForm(this.nominaFormat);
    }
    if(value == TypeDocument.Factura) this.format = TypeDocument.Factura;
    if(value == TypeDocument.Reporte_Ingresos) this.format = TypeDocument.Reporte_Ingresos;
  }
  
  createForm(format: reportNomina): FormGroup {
    return this.formB.group({
      businessName: [format.businessName, Validators.required],
      branch: [format.branch, Validators.required],
      job: [format.job, Validators.required],
      employerRegistration: [format.employerRegistration, Validators.required],
      names: [format.names, Validators.required],
      surnames: [format.surnames, Validators.required],
      RFC: [format.RFC, Validators.required],
      employeeNumber: [format.employeeNumber, Validators.required],
      medicalNumber: [format.medicalNumber, Validators.required],
      department: [format.department, Validators.required],
      salary: [format.salary, Validators.required],
      laboryDays: [format.laboryDays, Validators.required],
      period: [format.period, Validators.required],
      period2: [format.period, Validators.required]
    });
  }

  createNomina(data: reportNomina, value: string){
    if(this.form.valid){
      this.send = true;
      const pdf = {
        content: [
          {
            fontSize: 12,
            bold: true,
            text: `${data.businessName}\n\n`
          },
          {
            columns: [
              {
                width: '30%',
                fontSize: 9,
                text: `Version: 3.0
                      \n Sucursal: ${data.branch}
                      \n Puesto: ${data.job}
                      \n Fecha de pago: ${this.fecha}
                      \n Folio: A1950783`
              },
              {
                width: '70%',
                fontSize: 9,
                stack: [
                  {
                    bold: true,
                    text: `Registro patronal: ${data.employerRegistration} \n\n`
                  },
                  {
                    table: {
                      widths: ['20%', '20%', 'auto', '25%'],
                      body: [
                        [
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'Empleado'
                          },
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'Departamento'
                          },
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'Nombre'
                          },
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'RFC'
                          }
                        ],
                        [`${data.employeeNumber}`, `${data.department}`, `${data.names}`, `${data.RFC}`],
                        [
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'Num. Seguro'
                          },
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'Recibo'
                          },
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'Periodo que comprende'
                          },
                          {
                            fillColor: '#58556B',
                            color: '#ffffff',
                            text: 'Dias pagados'
                          },
                        ],
                        [`${data.medicalNumber}`, '15', `${data.period} Al ${data.period2}`, `${data.laboryDays}`]
                      ]
                    }
                  }
                ]
              }
            ]
          },
          { text: '\n' },
          {
            columns: [
              {
                fontSize: 9,
                table: {
                  widths: ['100%'],
                  body: [
                    [
                      {
                        fillColor: '#58556B',
                        color: '#ffffff',
                        alignment: 'center',
                        text: 'Percepciones'
                      }
                    ]
                  ]
                }
              },
              {
                fontSize: 9,
                table: {
                  widths: ['100%'],
                  alignment: 'center',
                  body: [
                    [
                      {
                        fillColor: '#58556B',
                        color: '#ffffff',
                        alignment: 'center',
                        text: 'Deducciones'
                      }
                    ]
                  ]
                }
              }
            ]
          },
          {
            columns: [
              {
                fontSize: 9,
                table: {
                  widths: ['20%', '40%', '20%', '20%'],
                  body: [
                    ['Clave', 'Concepto', 'Importe', 'Exento'],
                    ['001', 'Sueldo', `$${data.salary}`, '$0.00'],
                    ['008', 'Concepto2', `$${this.concepto.con1}`, '$0'],
                    ['013', 'Concepto3', `$${this.concepto.con2}`, '$0'],
                    ['015', 'Concepto4', `$${this.concepto.con3}`, '$0'],
                    ['021', 'Concepto5', `$${this.concepto.con4}`, '$0'],
                    [
                      { text: '\n' }, { text: '\n' }, { text: '\n' }, { text: '\n' },
                    ],
                    [
                      {
                        colSpan: 2,
                        text: 'Subtotal'
                      },
                      { },
                      { text: '$' + (data.salary + this.concepto.con1 + this.concepto.con2 + this.concepto.con3 + this.concepto.con4) },
                      { text: '$0' }
                    ],
                  ]
                },
                layout: 'headerLineOnly'
              },
              {
                fontSize: 9,
                table: {
                  widths: ['18%', '28%', '18%', '18%', '18%'],
                  body: [
                    ['Clave', 'Concepto', 'Importe', 'Gravado', 'Exento'],
                    ['002', 'IMSS', `$${this.gravado.gra1}`, `$${this.gravado.gra1}`, '$0'],
                    ['005', 'Concepto2', `$${this.gravado.gra2}`, `$${this.gravado.gra2}`, '$0'],
                    ['007', 'Concepto3', `$${this.gravado.gra3}`, `$${this.gravado.gra3}`, '$0'],
                    ['009', 'Concepto4', `$${this.gravado.gra4}`, `$${this.gravado.gra4}`, '$0'],
                    ['018', 'Concepto5', `$${this.gravado.gra5}`, `$${this.gravado.gra5}`, '$0'],
                    [
                      { text: '\n' }, { text: '\n' }, { text: '\n' }, { text: '\n' }, { text: '\n' }
                    ],
                    [
                      {
                        colSpan: 2,
                        text: 'Subtotal'
                      },
                      { },
                      { text: '$' + (this.gravado.gra1 + this.gravado.gra2 + this.gravado.gra3 + this.gravado.gra4) },
                      { text: '$' + (this.gravado.gra1 + this.gravado.gra2 + this.gravado.gra3 + this.gravado.gra4) },
                      { text: '$0' }
                    ],
                  ]
                },
                layout: 'headerLineOnly'
              }
            ]
          },
          { text: '\n\n\n' },
          {
            columns: [
              {
                alignment: 'center',
                fontSize: 9,
                table: {
                  widths: ['auto', 'auto'],
                  body: [
                    ['Acumulado Fondo Trabajador', 'Acumulado Fondo Empresa'],
                    ['$2760', '$2760']
                  ]
                }
              },
              {
                alignment: 'center',
                fontSize: 9,
                table: {
                  widths: ['auto', 'auto', '30%'],
                  body: [
                    ['Neto a pagar vales', 'Neto a pagar efectivo', 'Neto a pagar'],
                    [`$${this.vales}`, `$${data.salary}`, '$' + (this.vales + data.salary)]
                  ]
                }
              }
            ]
          },
          { text: '\n' },
          {
            fontSize: 10,
            text: `Recibi de ..., Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis illum adipisci temporibus ea, deleniti labore rerum fuga corrupti est aut quod? Aliquam a ex ipsum debitis asperiores odio facilis assumenda?`
          }
        ],
        footer: function(currentPage, pageCount) {
          return {
            columns:[
              {
                fontSize: 8,
                aligntment: 'start',
                text: 'Nomina de empleado'
              }, 
              {
                fontSize: 8,
                alignment: 'right',
                text: currentPage.toString() + ' de ' + pageCount
              }
            ],
            margin: [40, 0]
          }
        },
        pageMargins: [40, 40]
      }
      
      const document = pdfMake.createPdf(pdf);
      if(value == 'Show') document.open();
      if(value == 'Download') document.download();

    }else {
      this.toast.warning('Los datos no son validos o los campos estan vacios', '',
      { positionClass: 'toast-bottom-right' });
      this.formValid = false;
      this.send = false;
    }
  }

  reset(){
    this.send = false;
    this.formValid = true;
  }

}
