////////////////////////////////////////////
//Asignación de funciones a elementos HTML//
////////////////////////////////////////////
/*Aqui se conecta Javascript con FRONTEND, betch!
Y usamos variables universalessss, mas info aqueeh: http://librosweb.es/libro/javascript/capitulo_4/ambito_de_las_variables.html*/

var cbxCourse = $("#cbxCourse");
var cbxModule = $("#cbxModule");
var cbxProject = $("#cbxProject");
var cbxActivity = $("#cbxActivity");
var cbxProjectFW = $("#cbxProjectFW");
var cbxStudent = $("#cbxStudent");
var personalFollowHTML = $("#personalFollow")

var currentStudentSelected; //Necesitaremos guardar en esta variable el alumno seleccionado para algunas funciones

var tableStudents = $('#myTable'); //Table PupilFollowing
var tbStudent = $("#tbAlumnos"); //Body table PupilFollowing
var tableHistory = $('#historyTable'); //Table History
var tbHistory = $('#tbHistory'); //Body Table History

var date = $('#datepicker');
var nameStudentHTML = $('.nameStudent')

//Activity fields
var actName=$('#actName');
var actCode=$('#actCode');
var actStatus=$('#actStatus');
var actClasses=$('#actClasses');
var actCalification=$('#actCalification');

cbxProjectFW.on('change', function(){projectWFChanged()});
cbxCourse.on('change', function(){courseChanged()});
cbxModule.on('change', function(){moduleChanged()});
cbxProject.on('change', function(){projectChanged()});
cbxActivity.on('change', function(){activityChanged()});
cbxStudent.on('change', function(){studentChanged()});
tableStudents.on('click', '.clickable-row', function(event) {$(this).addClass('active').siblings().removeClass('active');});

/////////////////////////////////
//Funciones para limpiar campos//
/////////////////////////////////

//Resetear ComboBox de Alumnos a valores iniciales
function resetStudentTable(){
    tbStudent.empty();
}

function resetHistoryTable(){
    tbHistory.empty();
}

//Resetear ComboBox de Módulos a valores iniciales
function resetModuleField(){
    cbxModule.empty();
    cbxModule.append(new Option('Módulo', ''));
    cbxModule.selectpicker('refresh');
}

function resetProjectField(){
    cbxProject.empty();
    cbxProject.append(new Option('Proyectos', ''));
    cbxProject.selectpicker('refresh');
}

function resetStudentField(){
    cbxStudent.empty();
    cbxStudent.append(new Option('Alumno', ''));
    cbxStudent.selectpicker('refresh');
    resetHistoryTable();
}

function resetActivityField(){
    cbxActivity.empty();
    cbxActivity.append(new Option('Actividad', ''));
    cbxActivity.selectpicker('refresh');
    resetActivityData();
}
function resetActivityData(){
    actName.text('---');
    actCode.text('---');
    actStatus.text('---');
    actClasses.text('---');
    actCalification.text('---');
}

function resetPersonalFollow(){
    resetProjectField();
    resetActivityField();
    personalFollowHTML.addClass('disabledDIV');
}
///////////////////////
//Funciones para AJAX//
///////////////////////

//Esta funcion hace algo
function courseChanged(){
    resetModuleField();
    resetStudentTable();
    resetPersonalFollow();
    resetHistoryTable();
    resetStudentField();
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetModuleField();
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de los modulos
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    console.log(text+": "+value);
                    cbxModule.append(new Option(text, value));
                }
                cbxModule.selectpicker('refresh');
            }
        });
    }
}

function projectWFChanged(){
  resetStudentTable();
  resetProjectField();
  resetPersonalFollow();
  if(this.val!=''){
      //Carga de Alumnos
      $.ajax({
          url: url,
          type: 'GET',
          data: {idCourse: cbxCourse.val(),idProjectFW: cbxProjectFW.val(), queryId: "students"},
          dataType: 'json',
          success: function(info){
              for(var i=0;i<info.length;i++){
                  informacion = info[i]['model'];
                  console.log(informacion);
                  if (informacion=="database.student"){
                    var texto = info[i].fields.name + " " + info[i].fields.surname;
                    var value = info[i].pk;
                    var elemento = '<tr class="clickable-row" onclick="selectStudent(event,'+value+')"><td><input type="checkbox"></td><td>'+texto+'</td><td style="text-align:center;"><select class="cbxActivityFW" data-width="100%"><option value="">---</option></select></td></tr>';
                    tbStudent.append(elemento);
                  }
                  if (informacion=="database.activity"){

                    var textoActivity = info[i].fields.nameActivity;
                    var valueActivity = info[i].pk;

                    $('.cbxActivityFW').append(new Option(textoActivity, valueActivity));

                  }

                  // <select id="cbxProjectFW" class="selectpicker" data-width="100%">
                  //     <option value=''>Proyecto</option>
                  // </select>
              }
              $('.cbxActivityFW').selectpicker('refresh');

          }
      });
}
}
//Cambia CBX MODULO
function moduleChanged(){
    resetStudentField();
    resetStudentTable();
    resetProjectField();
    resetPersonalFollow();

    resetHistoryTable();
    if(this.val!=''){
        //Carga de Alumnos
        // $.ajax({
        //     url: url,
        //     type: 'GET',
        //     data: {idCourse: cbxCourse.val(), idProjectFW:1, queryId: "students"},
        //     dataType: 'json',
        //     success: function(info){
        //         for(var i=0;i<info.length;i++){
        //             var texto = info[i].fields.name + " " + info[i].fields.surname;
        //             var value = info[i].pk;
        //             try{
        //                 cbxStudent.append(new Option(texto,value));
        //             }catch(err){console.log(err)}
        //         }
        //         try{
        //             cbxStudent.selectpicker('refresh');
        //         }catch(e){console.log(err)}
        //     }
        // });

        //Carga de Projectos
        $.ajax({
            url: url,
            type: 'GET',
            data: {module: cbxModule.val(), queryId: "projects"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de los proyectos
                    var nameProject = info[i].fields.nameProject;
                    var value = info[i].pk;
                    console.log(nameProject+": "+value);
                    cbxProject.append(new Option(nameProject, value));
                    cbxProjectFW.append(new Option(nameProject, value));
                }
                cbxProject.selectpicker('refresh');
                cbxProjectFW.selectpicker('refresh');
            }
        });
    }


function projectChanged(){
    resetActivityField();
    $.ajax({
        url: url,
        type: 'GET',
        data: {idCourse: cbxCourse.val(),
               idProject: cbxProject.val(),
               queryId: "activities"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                //El valor de las opciones de los select es el ID de las Activities
                var nameActivity = info[i].fields.nameActivity;
                var value = info[i].pk;
                console.log(nameActivity+": "+value);
                cbxActivity.append(new Option(nameActivity, value));
            }
            cbxActivity.selectpicker('refresh');
        }
    });
}

function activityChanged(){
    resetActivityData();
    $.ajax({
        url: url,
        type: 'GET',
        data: {idActivity: cbxActivity.val(),
               idStudent: currentStudentSelected,
               queryId: "working"},
        dataType: 'json',
        success: function(info){
            i=info[0].fields;
            i2=info[1].fields;
            actName.text(i2.nameActivity);
            actCode.text(info[1].pk);
            if(i.hasFinish){
                actStatus.css('color','green');
                actStatus.text('Terminado');
            }else{
                actStatus.css('color','yellow');
                actStatus.text('Pendiente');
            }
            actClasses.text(i.numberOfClasses);
            actCalification.text(i.calification);
        }
    });
}

function studentChanged(){
    //Cuando el select cbxStudent cambia de valor carga los datos correspondientes del alumno
    resetHistoryTable();
    console.log(cbxStudent.val());
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idStudent: cbxStudent.val(), queryId: "history"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    for(var x=0;i<info.length;x++){
                        if(info[i]['model']=='database.OnClass'){
                            console.log(info[x]);
                            if(info[x].fields.idSF==info[i].pk){
                                var activity = info[x].fields.idActivity;
                                console.log(activity);
                                x=info.length;
                            }
                        }
                    }
                    var presencia = info[i].fields.presenceSF;
                    var fecha = info[i].fields.dateSF;
                    console.log(fecha);
                    if(presencia){
                        presencia='<span class="glyphicon glyphicon-ok verde" aria-hidden="true"></span>';
                    }else{
                        presencia='<span class="glyphicon glyphicon-remove rojo" aria-hidden="true"></span>';
                    }
                    var elemento = '<tr class="clickable-row"><th scope="row">'+presencia+'</th><td>'+fecha+'</td><td style="text-align:center;">'+activity+'</td></tr>';
                    tbHistory.append(elemento);
                }
            }
        });
    }
}

//ACA PASA LA MAGIA DE LA SELECCION DE ESTUDIANTE
function selectStudent(evt,valor) {
    console.log(valor);
    currentStudentSelected=valor;
    $.ajax({
        url: url,
        type: 'GET',
        data: {idStudent: currentStudentSelected,
               queryId: "onlyStudent"},
        dataType: 'json',
        success: function(info){
            nameStudentHTML.text(info[0].fields.name+' '+info[0].fields.surname);
        }
    });
    personalFollowHTML.removeClass('disabledDIV');
    cbxActivity[0].selectedIndex = 0;
    resetActivityData();
}

    // Contact GitHub API Training Shop Blog About
    activityChanged();
}
