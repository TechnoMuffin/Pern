////Variables globales
var txtModuleName = $('#txtModuleName');
var createModulo = $('#createModulo');
var cbxCourse = $('#cbxCourse');
////Asignacion de Funciones
createModulo.on('click', function() {
    createModule()
});
////Funciones reales
function createModule() {
    if (txtModuleName.val() != '' && cbxCourse.val()!='') {
        $.ajax({
            url: urlModule,
            type: 'GET',
            data: {
                nameModule: txtModuleName.val(),
                course: cbxCourse.val(),
                queryId: 'newModule'
            },
            success: function() {
              console.log('Modulo creado');
              cbxCourse.val('0');
              txtModuleName.val('');
            }
        });
    }else{
      alert('NOOOOOOOOOOOOOOOOOOOOOOO')
    }
}

function refreshModules(){
  resetCbx()
}
