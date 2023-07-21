from flask import Blueprint, render_template, request, flash, jsonify, redirect, url_for
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
from sqlalchemy import func

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
#@login_required
def home():
    if not current_user.is_authenticated:
        # Redirect to the login page if the user is not authenticated
        return redirect(url_for('auth.login'))

    if request.method == 'POST': 
        note_title = request.form.get('note-title')
        note = request.form.get('note')#Gets the note from the HTML 

        if not note_title or not note:
            flash('Both Note Title and Content are required!', category='error') 
        else:
            new_note = Note(data_title=note_title, data=note, user_id=current_user.id)  #providing the schema for the note 
            db.session.add(new_note) #adding the note to the database 
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("home.html", user=current_user,user_id=current_user.id)


@views.route('/delete-note', methods=['POST'])
def delete_note():  
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})

@views.route('/edit-note', methods=['POST'])
def edit_note():

    note = request.json
    noteId = note['noteId']
    noteTitle = note['noteTitle']
    noteContent = note['noteContent']

    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            note.data_title = noteTitle 
            note.data = noteContent  
            db.session.commit()

    return jsonify({})

@views.route('/search-note',methods=['GET'])
def search_note():
    #searchContent = request.args.get('noteContent')
    # Retrieve the currently logged-in user's ID
    user_id = current_user.id

    # Get the search content from the request and convert it to lowercase
    search_content = request.args.get('noteContent', '').lower()

    # Perform the case-insensitive search in the database for notes with matching content or title
    notes = Note.query.filter(
        ((func.lower(Note.data).contains(search_content)) |
         (func.lower(Note.data_title).contains(search_content))) &
        (Note.user_id == user_id)
    ).all()

    # Process the notes and return the results as JSON
    result = [{'id': note.id, 'data_title': note.data_title, 'data': note.data, 'date': note.date} for note in notes]
    return jsonify(result)
