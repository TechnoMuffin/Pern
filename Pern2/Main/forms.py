from django.forms import ModelForm, ClearableFileInput
from django import forms
from database.models import Document

class CustomClearableFileInput(ClearableFileInput):
    template_with_clear = '<br>  <label for="%(clear_checkbox_id)s">%(clear_checkbox_label)s</label> %(clear)s'

class FormEntrada(forms.ModelForm):
    class Meta:
        model = Document
        fields = ('nameDocument', 'idCourse','idModule', 'archivo','commentDoc')
        widgets = {
            'archivo': CustomClearableFileInput
        }
