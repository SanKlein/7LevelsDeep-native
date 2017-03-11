import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableHighlight, AsyncStorage, TextInput, Dimensions, TouchableOpacity, Linking } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const URL = 'https://levelsdeep.herokuapp.com'

const questions = ['What do you want to do?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?']
const { height, width } = Dimensions.get('window')

export default class App extends Component {
  constructor(props) {
    super(props)

    // sets state to persistent state or initial state
    this.state = {
      exercises: [],
      exercise: {
        date: Date.now(),
        answers: ['']
      },
      currentAnswer: 0,
      answerError: '',
      started: false,
      editing: false,
      userCount: 0
    }

    // bind functions to this
    this.startExercise = this.startExercise.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.changeAnswer = this.changeAnswer.bind(this)
    this.setCurrent = this.setCurrent.bind(this)
    this.next = this.next.bind(this)
    this.loadExercise = this.loadExercise.bind(this)
    this.deleteExercise = this.deleteExercise.bind(this)
  }

  componentWillMount() {
    AsyncStorage.getItem('levelsStore').then(value => {
      if (value && value.length) {
        this.setState(JSON.parse(value))
      }
    }).catch(error => null)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const state = this.state
    if (state.exercises !== nextState.exercises) {
      return true
    }
    if (state.exercise.answers !== nextState.exercise.answers) {
      return true
    }
    if (state.currentAnswer !== nextState.currentAnswer) {
      return true
    }
    if (state.started !== nextState.started) {
      return true
    }
    if (state.editing !== nextState.editing) {
      return true
    }
    return false
  }

  componentDidUpdate() {
    AsyncStorage.setItem('levelsStore', JSON.stringify(this.state))
  }

  startExercise() {
    this.setState({
      exercise: {
        date: Date.now(),
        answers: ['']
      },
      started: true,
      editing: false
    })
    this.refs.answer0.focus()
  }

  setCurrent(index) {
    this.setState({
      currentAnswer: index
    })
  }

  handleEnter(e) {
    if (e.nativeEvent.key == "Enter") {
      this.next()
    }
  }

  changeAnswer(text, index) {
    const match = /\r|\n/.exec(text)
    if (match) {
      text = text.trim()
    }
    this.setState({
      exercise: {
        ...this.state.exercise,
        answers: [
          ...this.state.exercise.answers.slice(0, index),
          text,
          ...this.state.exercise.answers.slice(index + 1)
        ]
      }
    })
  }

  next(set) {
    const state = this.state
    const index = set ? set : state.currentAnswer
    const exercise = state.exercise
    let answers = exercise.answers
    const answer = answers[index]
    const thisAnswer = 'answer' + index.toString()
    const nextAnswer = 'answer' + (index + 1).toString()
    if (answer === '') { // if current answer is empty
      this.refs[thisAnswer].focus()
      return
    }
    const answersLength = answers.length
    if (index === 6) { // last button clicked
      let exercises = state.exercises
      if (!state.editing) { // not editing
        fetch(URL + '/api/count', { method: 'POST' })
        this.setState({
          exercises: exercises.concat([exercise]),
          exercise: {
            date: Date.now(),
            answers: ['']
          },
          started: false,
          currentAnswer: 0
        }, () => this.refs.scroll.scrollToPosition(0, height, true))
      } else { // we are editing
        const editIndex = exercises.findIndex(e => e.date === exercise.date) // find exercise with the same date
        if (editIndex === -1) { // could not find the exercise we were editing
          this.setState({
            exercises: exercises.concat([exercise]),
            exercise: {
              date: Date.now(),
              answers: ['']
            },
            started: false,
            editing: false,
            currentAnswer: 0
          }, () => this.refs.scroll.scrollToPosition(0, height, true))
        } else { // add new exercise to exercises and reset exercise
          exercises = [
            ...exercises.slice(0, editIndex),
            exercise,
            ...exercises.slice(editIndex + 1)
          ]
          this.setState({
            exercises: exercises,
            exercise: {
              date: Date.now(),
              answers: ['']
            },
            started: false,
            editing: false,
            currentAnswer: 0
          })
        }
      }
    } else { // not on last question
      if (index === answersLength - 1) { // no answers ahead of the current answer
        answers = answers.concat([''])
        this.setState({
          exercise: {
            ...exercise,
            answers: answers
          },
          currentAnswer: answersLength
        }, () => this.refs[nextAnswer].focus())
        return
      } else { // current answer is not the last answer answered
        this.setState({
          currentAnswer: index + 1
        }, () => this.refs[nextAnswer].focus())
      }
    }
  }

  loadExercise(index) {
    const exercise = this.state.exercises[index]
    this.setState({
      ...this.state,
      exercise: exercise,
      editing: true,
      started: true
    }, () => this.refs.answer0.focus())
  }

  deleteExercise(index) {
    const exercises = this.state.exercises
    const exercise = exercises[index]
    const current = exercise.date === this.state.exercise.date ? { date: Date.now(), answers: [''] } : this.state.exercise
    this.setState({
      exercises: [
        ...exercises.slice(0, index),
        ...exercises.slice(index + 1)
      ],
      exercise: current,
      currentAnswer: 0
    })
  }

  shareTwitter() {
    Linking.openURL('https://twitter.com/intent/tweet?text=Discover Your Why. www.7levelsdeep.com')
  }

  shareFacebook() {
    Linking.openURL('https://www.facebook.com/dialog/share?app_id=1656429184383922&display=popup&href=http://www.7levelsdeep.com&redirect_uri=http://www.7levelsdeep.com/')
  }

  shareLinkedin() {
    Linking.openURL('http://www.linkedin.com/shareArticle?mini=true&url=http://www.7levelsdeep.com&title=Discover%20Your%20Why&description=A%20short%20exercise%20to%20help%20discover%20your%20why')
  }

  shareEmail() {
    Linking.openURL('mailto:?subject=Discover Your Why&body=www.7levelsdeep.com')
  }

  openLink() {
    Linking.openURL('http://www.parkerklein.me/')
  }

  render() {
    let lastButton
    if (this.state.exercise.answers.length === 7 && this.state.exercise.answers[6] !== '') {
      if (this.state.editing) {
        lastButton = <TouchableOpacity style={styles.finishExerciseButton} onPress={() => this.next(6)}><Text style={styles.finishExerciseButtonText}>SAVE</Text></TouchableOpacity>
      } else {
        lastButton = <TouchableOpacity style={styles.finishExerciseButton} onPress={() => this.next(6)}><Text style={styles.finishExerciseButtonText}>FINISH</Text></TouchableOpacity>
      }
    }

    return (
      <View style={styles.app}>
        <KeyboardAwareScrollView style={styles.app} ref='scroll'>
          <View style={styles.intro}>
            <View style={styles.introContent}>
              <Text style={styles.title}>7 Levels Deep</Text>
              <Text style={styles.introText}>Discover Your Why</Text>
              <TouchableOpacity style={styles.startButton} onPress={this.startExercise}><Text style={styles.startButtonText}>START EXERCISE</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.why}>
            <Text style={styles.whyTitle}>WHY?</Text>
            <Text style={styles.whyText}>Discover what drives you to take action</Text>
          </View>
          <View style={styles.instructions}>
            <Text style={styles.whyTitle}>INSTRUCTIONS</Text>
            <Text style={styles.whyText}>Take 10-15 minutes to reflect and answer 7 questions</Text>
          </View>
          <View style={styles.exercise}>
            <View style={styles.exerciseContent}>
              {this.state.exercise.answers.map((answer, index) => {
                const refId = "answer" + index.toString()
                return (
                  <View style={styles.answerContainer} key={index}>
                    <View style={styles.answerContent}>
                      <View style={styles.answerPropmt}><Text style={styles.answerPromptText}>{index + 1}. {questions[index]}</Text></View>
                      <View style={styles.answer}>
                        <AutoGrowingTextInput style={styles.answerText} multiline={true} ref={refId} value={answer} onKeyPress={(e) => this.handleEnter(e)} onChangeText={(text) => this.changeAnswer(text, index)} onFocus={() => this.setCurrent(index)} returnKeyType='next' selectionColor='#474747'  />
                      </View>
                      { answer !== '' && this.state.currentAnswer === index && index !== 6 && <TouchableOpacity style={styles.nextButton} onPress={() => this.next()}><Text style={styles.nextButtonText}>Next</Text></TouchableOpacity> }
                      { index === 6 && lastButton }
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={styles.past} ref="past">
              <Text style={styles.pastTitle}>Past Exercises</Text>
              {this.state.exercises.length > 0 && <View style={styles.pastExercises}>
                {this.state.exercises.map((exercise, index) => (
                  <View style={styles.pastExercise} key={index}>
                    <TouchableHighlight style={styles.pastExerciseButton} onPress={() => this.loadExercise(index)} underlayColor="#f0f0f0"><Text style={styles.pastExerciseText} ellipsizeMode='tail' numberOfLines={1}>{exercise.answers[0]}</Text></TouchableHighlight>
                    <TouchableHighlight style={styles.deletePastExerciseButton} onPress={() => this.deleteExercise(index)} underlayColor="#f0f0f0"><Text style={styles.deletePastExerciseButtonText}>Delete</Text></TouchableHighlight>
                  </View>
                ))}
              </View>}
              <TouchableHighlight style={styles.takeAgainButton} onPress={this.startExercise}><Text style={styles.takeAgainButtonText}>START NEW EXERCISE</Text></TouchableHighlight>
          </View>
          <View style={styles.share}>
            <View style={styles.shareTitleView}><Text style={styles.shareTitle}>If you found this exercise useful,</Text><Text style={styles.shareTitleMain}>Share It</Text></View>
            <View style={styles.shareButtons}>
              <TouchableOpacity style={styles.shareButton} onPress={this.shareTwitter}><FontAwesome name="twitter" color="#e85454" size={24} /></TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={this.shareFacebook}><FontAwesome name="facebook" color="#e85454" size={24} /></TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={this.shareLinkedin}><FontAwesome name="linkedin" color="#e85454" size={24} /></TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={this.shareEmail}><MaterialIcons name="email" color="#e85454" size={24} /></TouchableOpacity>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with <FontAwesome name="heart" color="#e85454" size={14} /> by </Text><TouchableOpacity style={styles.myLink} onPress={this.openLink}><Text style={styles.myLinkText}>Parker Klein</Text></TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  intro: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introContent: {
    alignItems: 'center',
  },
  title: {
    color: '#e85454',
    fontSize: 52,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10,
  },
  introText: {
    color: '#474747',
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#e85454',
    height: 44,
    width: (width/2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  why: {
    height: (height/6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  whyTitle: {
    color: '#e85454',
    marginBottom: 5,
    fontWeight: '800',
    fontSize: 18,
  },
  whyText: {
    color: '#474747',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  instructions: {
    height: (height/6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
    paddingBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  exercise: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  exerciseContent: {

  },
  answerContainer: {
    margin: 20,
  },
  answerContent: {
  },
  answerPropmt: {
    marginBottom: 7,
  },
  answerPromptText: {
    color: '#e85454',
    fontWeight: '700',
    fontSize: 18,
  },
  answer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
    minHeight: 40,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  answerText: {
    fontSize: 16,
    color: '#474747',
    lineHeight: 24,
    minHeight: 40,
  },
  nextButton: {
    alignItems: 'flex-end',
    paddingTop: 4,
    paddingRight: 8,
  },
  nextButtonText: {
    fontSize: 14,
    color: '#777'
  },
  finishExerciseButton: {
    width: width - 40,
    backgroundColor: '#e85454',
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  finishExerciseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  past: {
    minHeight: height/3,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  pastTitle: {
    textAlign: 'center',
    color: '#e85454',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 15,
  },
  pastExercises: {
    flex: 1,
    justifyContent: 'flex-start',
    width: width,
  },
  pastExercise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  pastExerciseButton: {
    flex: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  },
  pastExerciseText: {
    color: '#474747',
  },
  deletePastExerciseButton: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePastExerciseButtonText: {
    color: '#e85454',
    textAlign: 'center',
  },
  takeAgainButton: {
    width: width * 4 / 5,
    backgroundColor: '#f0f0f0',
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 15,
  },
  takeAgainButtonText: {
    color: '#e85454',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  share: {
    height: height/2,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  shareTitleView: {
    marginBottom: 40,
  },
  shareTitle: {
    color: '#474747',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 20,
    marginBottom: 5,
  },
  shareTitleMain: {
    color: '#e85454',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '800',
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shareButton: {
    width: width/5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: width/5,
    borderRadius: width/10,
    margin: 5,
  },
  footer: {
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    textAlign: 'center',
    color: '#474747',
  },
  myLink: {
  },
  myLinkText: {
    color: '#e85454',
  },
})
