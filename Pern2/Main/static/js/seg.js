////////////////////////////////////////////
//Asignación de funciones a elementos HTML//
////////////////////////////////////////////
/*Aqui se conecta Javascript con FRONTEND, betch!
Y usamos variables universalessss, mas info aqueeh: http://librosweb.es/libro/javascript/capitulo_4/ambito_de_las_variables.html*/

//Variables de /pupilFollowing
var cbxCourse = $("#cbxCourse");
var cbxModule = $("#cbxModule");
var cbxProject = $("#cbxProject");
var cbxActivity = $("#cbxActivity");
var cbxStudent = $("#cbxStudent");
var currentStudentSelected; //Necesitaremos guardar en esta variable el alumno seleccionado para algunas funciones
var cbxProjectFW = $("#cbxProjectFW");
var personalFollowHTML = $("#personalFollow")
var tableStudents = $('#myTable'); //Table PupilFollowing
var tbStudent = $("#tbAlumnos"); //Body table PupilFollowing
var date = $('#datepicker');
var nameStudentHTML = $('.nameStudent')
//Activity fields
var actName=$('#actName');
var actCode=$('#actCode');
var actStatus=$('#actStatus');
var actClasses=$('#actClasses');
var actCalification=$('#actCalification');
var tbFF = $('#tbFulfillments'); //Tabla de cumplimientos

//Variables de /rotacionAlumno
var cbxCourseRotation = $("#cbxCourseRotation");
var cbxRotationA = $("#cbxRotationA");
var cbxRotationB = $("#cbxRotationB");
var toSelectB = $("#toSelectB");
var toSelectA = $("#toSelectA");
var toSelectB1 = $("#toSelectB1");
var toSelectA1 = $("#toSelectA1");
var allToSelectB = $("#allToSelectB");
var allToSelectA = $("#allToSelectA");
var studentSelectA = $("#studentSelectA");
var studentSelectB = $("#studentSelectB");
var selecterDiv = $('#selectionerDiv');
var txtRotationName = $('#txtRotationName');
var btnCreateRotation = $('#createRotation');
var modalTitle = $('#modal-title');
var modalText = $('#modal-text');
var modal = $('#modal');

//Variables de /historial
var tableHistory = $('#historyTable'); //Table History
var tbHistory = $('#tbHistory'); //Body Table History


tableHistory.css('max-height', $( window ).height());


//Asignacion de Funciones a elementos HTML
cbxProjectFW.on('change', function(){projectWFChanged()});
cbxCourse.on('change', function(){courseChanged()});
cbxModule.on('change', function(){moduleChanged()});
cbxProject.on('change', function(){projectChanged()});
cbxActivity.on('change', function(){activityChanged()});
cbxStudent.on('change', function(){studentChanged()});
cbxCourseRotation.on('change', function(){courseRotationChanged()});
tableStudents.on('click', '.clickable-row', function(event) {$(this).addClass('active').siblings().removeClass('active');});
cbxRotationA.on('change', function(){cbxRotationAchanged()});
cbxRotationB.on('change', function(){cbxRotationBchanged()});
toSelectB.on('click', function(){toSelectMulB()});
toSelectA.on('click', function(){toSelectMulA()});
toSelectA.on('click', function(){toSelectMulA()});
allToSelectB.on('click', function(){allToSelectMulB()});
allToSelectA.on('click', function(){allToSelectMulA()});
btnCreateRotation.on('click', function(){createRotation()});

/////////////////////////////////
//Funciones para limpiar campos//
/////////////////////////////////

//Vaciar la tabla de alumnos
function resetStudentTable(){
    tbStudent.empty();
}

function resetHistoryTable(){
    tbHistory.empty();
}

//Vaciar la tabla de cumplimientos
function resetFFTable(){
    tbFF.empty();
}

//Resetear ComboBox de Módulos a valores iniciales
function resetModuleField(){
    cbxModule.empty();
    cbxModule.append(new Option('Módulo', ''));
    cbxModule.selectpicker('refresh');
}

function resetRotationAField(){
    cbxRotationA.empty();
    cbxRotationA.append(new Option('Alumnos sin Rotación', ''));
    cbxRotationA.selectpicker('refresh');
}

function resetRotationBField(){
    cbxRotationB.empty();
    cbxRotationB.append(new Option('Alumnos sin Rotación', ''));
    cbxRotationB.selectpicker('refresh');
}

function resetStudentSelectB(){
    studentSelectB.empty();
    studentSelectB.change();
}

function resetStudentSelectA(){
    studentSelectA.empty();
    studentSelectA.change();
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
                    cbxModule.append(new Option(text, value));
                }
                cbxModule.selectpicker('refresh');
            }
        });
    }
}

function courseRotationChanged(){
    resetRotationAField();
    resetRotationBField();
    resetStudentSelectA();
    resetStudentSelectB();
    if($(this).val!=''){
        selecterDiv.removeClass('disabledDIV');
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourseRotation.val(), queryId: "rotations"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var text = info[i].fields.nameRotation;
                    var value = info[i].pk;
                    cbxRotationA.append(new Option(text, value));
                    cbxRotationB.append(new Option(text, value));
                }
                cbxRotationB.val($('#cbxRotationB option:selected').next().val());
                cbxRotationA.selectpicker('refresh');
                cbxRotationB.selectpicker('refresh');
            }
        });
    }else{
        selecterDiv.addClass('disabledDIV');
    }
}

function cbxRotationAchanged(){
    resetStudentSelectA();
    $('#cbxRotationB option').each(function(){
        $(this).removeClass('disabledDIV');
    });
    $('#cbxRotationB option').each(function(){
        $(this).removeClass('disabledDIV');
        if($(this).val()==cbxRotationA.val()){
            console.log(cbxRotationA.val());
            $(this).addClass('disabledDIV');
        }
    });
    cbxRotationB.selectpicker('refresh');
    ajaxForGetStudentRotation(cbxRotationA, studentSelectA);
}

function ajaxForGetStudentRotation(fromCbx, elemento){
    $.ajax({
        url: url,
        type: 'GET',
        data: {idRotation: fromCbx.val(), queryId: "studentsByRotation"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                var texto = info[i].fields.surname + ", " + info[i].fields.name;
                var value = info[i].pk;
                elemento.append(new Option(texto, value));
                elemento.change();
            }
        }
    });
}

function cbxRotationBchanged(){
    resetStudentSelectB();
    $('#cbxRotationA option').each(function(){
        $(this).removeClass('disabledDIV');
    });
    $('#cbxRotationA option').each(function(){
        $(this).removeClass('disabledDIV');
        if($(this).val()==cbxRotationB.val()){
            console.log(cbxRotationA.val());
            $(this).addClass('disabledDIV');
        }
    });
    cbxRotationA.selectpicker('refresh');
    ajaxForGetStudentRotation(cbxRotationB, studentSelectB);
}

function toSelectMulB(){
    var items = [];
    $('#studentSelectA option:selected').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectB.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationB,items);
}

function ajaxForSetStudentsRotations(newRotation,StudentsIDS){
    $.ajax({
        url: url,
        type: 'GET',
        data: {'studentsIds[]':StudentsIDS, newIdRotation: newRotation.val(), queryId: "changeStudentsRotation"},
        dataType: 'json',
        success: function(info){
            console.log('Saved');
        }
    });
}

function toSelectMulA(){
    var items = [];
    $('#studentSelectB option:selected').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectA.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationA,items);
}

function allToSelectMulB(){
    var items = [];
    $('#studentSelectA option').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectB.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationB,items);
}

function allToSelectMulA(){
    var items = [];
    $('#studentSelectB option').each(function(){
        items.push($(this).val());
        var element = $(this).detach();
        studentSelectA.append(element);
    });
    ajaxForSetStudentsRotations(cbxRotationA,items);
}

function createRotation(){
    if(txtRotationName.val()=='' || cbxCourse.val()=='' || cbxModule.val()==''){
        modalText.text('Error');
        modalTitle.text('Por favor, rellene los campos correctamente.');
        modal.modal('toggle');
    }else{   
        $.ajax({
            url: url,
            type: 'GET',
            data: {nameRotation: txtRotationName.val(), idCourse: cbxCourse.val(), idModule: cbxModule.val(), queryId: "createRotation"},
            dataType: 'json',
            success: function(){
            }
        });
        modalText.text('Éxito!');
        modalTitle.text('Se ha creado la rotación '+txtRotationName.val()+' correctamente.');
        modal.modal('toggle');
        txtRotationName.val('');
        cbxCourse.val('');
        resetModuleField();
        resetRotationAField();
        resetRotationBField();
        resetStudentSelectA();
        resetStudentSelectB();
    }
}

function projectWFChanged(){
    resetStudentTable();
    resetProjectField();
    resetPersonalFollow();
    resetHistoryTable();
    if(this.val!=''){
        //Carga de Alumnos
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "students"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var texto = info[i].fields.name + " " + info[i].fields.surname;
                    var value = info[i].pk;
                    var elemento = '<tr claMóduloss="clickable-row" onclick="selectStudent(event,'+value+')"><td><input type="checkbox"></td><td>'+texto+'</td><td style="text-align:center;"><select><option value="">---</option></select></td></tr>';
                    tbStudent.append(elemento);
                    try{
                        cbxStudent.append(new Option(texto,value));
                    }catch(err){console.log(err)}
                }
                try{
                    cbxStudent.selectpicker('refresh');
                }catch(e){console.log(err)}
            }
        });
        $.ajax({
            url: url,
            type: 'GET',
            data: {idProject: cbxProjectFW.val(), queryId: "fulfillments"},
            dataType: 'json',
            success: function(info){
                resetFFTable();
                for(var x=0;x<info.length;x++){
                    nameFF = info[x]['fields']['nameFF'];
                    idFF = info[x]['pk'];
                    var elemento = '<tr><td><input type="checkbox"></td><td value =' + idFF +'>' + nameFF +'</td><td>%</td></tr>';
                    tbFF.append(elemento);
                }
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
    //Carga de Alumnos
    $.ajax({
        url: url,
        type: 'GET',
        data: {idCourse: cbxCourse.val(), queryId: "students"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                var texto = info[i].fields.name + " " + info[i].fields.surname;
                var value = info[i].pk;
                try{
                    cbxStudent.append(new Option(texto,value));
                }catch(err){console.log(err)}
            }
            try{
                cbxStudent.selectpicker('refresh');
            }catch(e){console.log(err)}
        }
    });

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
                cbxActivity.append(new Option(nameActivity, value));
            }
            cbxActivity.selectpicker('refresh');
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
                    var idSF=info[i].pk;
                    for(var v=0;v<info.length;v++){
                        if(info[v].model=='database.onclass'){
                            if(info[v].fields.idSF==idSF){
                                var activity = info[v].fields.idActivity[1];
                                var project = info[v].fields.idActivity[2];
                                v=info.length;
                            }
                        }
                    }
                    var presencia = info[i].fields.presenceSF;
                    var fecha = info[i].fields.dateSF;
                    var obs = info[i].fields.commentPF;
                    sinObs='<td><button type="button" class="btn btn-warning pull-right disabledDIV">'+
                        '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>'+
                        '</button></td>';
                    if(info[i].model=="database.studentfollowing"){
                        if(presencia){
                            presencia='<span class="glyphicon glyphicon-ok verde" aria-hidden="true"></span>';
                            var elemento = '<tr class="clickable-row">'+
                                '<th scope="row">'+presencia+'</th>'+
                                '<td>'+fecha+'</td>'+
                                '<td>'+activity+' de '+project+'</td>';
                            if(obs!=''){
                                elemento=elemento+'<td>'+createModalObs('modal'+idSF,obs)+'</td></tr>';
                            }else{
                                elemento=elemento+sinObs;
                            }
                        }else{
                            presencia='<span class="glyphicon glyphicon-remove rojo" aria-hidden="true"></span>';
                            var elemento = '<tr class="clickable-row">'+
                                '<th scope="row">'+presencia+'</th>'+
                                '<td>'+fecha+'</td>'+
                                '<td>Alumno Ausente</td>';
                            elemento=elemento+sinObs;
                        }
                        tbHistory.append(elemento);
                    }
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
    activityChanged();
}

//////////////////////////////
//Funcion de Modal Bootstrap//
//////////////////////////////
function createModalObs(idCoso,content){
    var someHTML = '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#'+idCoso+'">'+
        '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>'+
        '<div id="'+idCoso+'" class="modal fade" role="dialog">'+
        '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '<h4 class="modal-title">Observaciones</h4></div><div class="modal-body">'+
        '<p style="white-space: pre-wrap">'+content+'</p></div><div class="modal-footer">'+
        '<button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>'+
        '</div></div></div></div>';
    return someHTML;
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

//ACA PASA LA MAGIA DE LA SELECCION DE ESTUDIANTE
function selectStudent(evt,valor) {
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
