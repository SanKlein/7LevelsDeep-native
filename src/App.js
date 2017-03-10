import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableHighlight, AsyncStorage, TextInput, Dimensions, TouchableOpacity, StatusBar, findNodeHandle } from 'react-native'
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

  // runs before initial mount
  componentWillMount() {
    // const exercise = this.state.exercise
    // const index = exercise.answers.findIndex(answer => answer === '') // gets first blank answer index
    // if (index !== -1) {
    //   const answers = exercise.answers.slice(0, index + 1) // removes answers past the first blank answer
    //   // removes blank answers from state
    //   this.setState({
    //     exercise: {
    //       ...exercise,
    //       answers: answers
    //     },
    //     currentAnswer: index
    //   })
    // }
    //
    // const self = this
    //
    // this.setState({ isStoreLoading: true })
    //
    // AsyncStorage.getItem('deepStore').then(value => {
    //   (value && value.length) ? self.setState({ exercises: JSON.parse(value) }) : self.setState({ exercises: [] })
    //   self.setState({ isStoreLoading: false })
    // }).catch(error => {
    //   self.setState({ isStoreLoading: false })
    // })
  }

  // runs after initial mount
  componentDidMount() {
    // if (this.state.started) { // check if started
    //   const currentAnswer = this.state.currentAnswer
    //   // const elem = document.getElementById(currentAnswer.toString())
    //   if (currentAnswer === 0) { // on first answer
    //     // jump(document.getElementById('exercise'), {
    //     //   duration: 1000,
    //     //   callback: () => this.focusElem(currentAnswer.toString())
    //     // })
    //   } else { // past first answer
    //     const id = 'answer' + (currentAnswer - 1)
    //     // jump(document.getElementById(id), {
    //     //   duration: 1000,
    //     //   callback: () => this.focusElem(currentAnswer.toString())
    //     // })
    //   }
    // } else {
    //   // document.getElementById('0').addEventListener('focus', this.removeOnEnter) // adds event listener for focus on first answer
    //   // document.addEventListener('keypress', this.onEnter) // global event which will focus on first answer if enter button pressed
    // }
    // localStorage.setItem('levelState', JSON.stringify(this.state)) // persists state
    // // set height and value of each answer
    // const answers = document.querySelectorAll('.answer')
    // for (let i = 0; i < answers.length; i++) {
    //   const answer = answers[i]
    //   answer.style.height = answer.scrollHeight + "px"
    //   const val = answer.value
    //   answer.value = ''
    //   answer.value = this.capitalizeFirstLetter(val)
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // run checks to see if component should update
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

  // runs after each update of state
  componentDidUpdate() {
    // localStorage.setItem('levelState', JSON.stringify(this.state)) // persists state
    // set height and value of each answer
    // const answers = document.querySelectorAll('.answer')
    // for (let i = 0; i < answers.length; i++) {
    //   const answer = answers[i]
    //   answer.style.height = answer.scrollHeight + "px"
    // }
  }

  // starts exercise
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

  // sets currentAnser index to the focused answer's index
  setCurrent(index) {
    this.setState({
      currentAnswer: index
    })
  }

  // handle when key down on text area is enter button
  handleEnter(e) {
    if (e.nativeEvent.key == "Enter") { // enter button keyCode = 13
      this.next()
    }
  }

  // runs when answer is changed
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

  // runs on enter when focused on answer
  next() {
    const state = this.state
    const index = state.currentAnswer
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
        })
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
          })
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

  // load past exercise
  loadExercise(index) {
    const exercise = this.state.exercises[index]
    this.setState({
      ...this.state,
      exercise: exercise,
      editing: true,
      started: true
    }, () => this.refs.answer0.focus())
  }

  // delete past exercise
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

  // format past exercise date
  formatDate(date) {
    const end = new Date(date)
    const day = end.getDate()
    const month = end.getMonth()
    const year = end.getFullYear()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[month]} - ${day < 10 ? '0' : ''}${day} - ${year}`
  }

  shareTwitter() {
    // window.open('https://twitter.com/intent/tweet?text=www.7levelsdeep.com')
  }

  shareFacebook() {
    // window.open('https://www.facebook.com/dialog/share?app_id=1656429184383922&display=popup&href=http://www.7levelsdeep.com&redirect_uri=http://www.7levelsdeep.com/')
  }

  shareLinkedin() {
    // window.open('http://www.linkedin.com/shareArticle?mini=true&url=http://www.7levelsdeep.com&title=Discover%20Your%20Why&description=A%20short%20exercise%20to%20help%20discover%20your%20why')
  }

  shareEmail() {
    // window.open('mailto:?subject=Discover Your Why&body=www.7levelsdeep.com')
  }

  openLink() {
    // window.open('http://www.parkerklein.me/')
  }

  render() {
    let lastButton
    if (this.state.exercise.answers.length === 7 && this.state.exercise.answers[6] !== '') {
      if (this.state.editing) {
        lastButton = <TouchableOpacity style={styles.finishExerciseButton} onPress={this.next}><Text style={styles.finishExerciseButtonText}>SAVE</Text></TouchableOpacity>
      } else {
        lastButton = <TouchableOpacity style={styles.finishExerciseButton} onPress={this.next}><Text style={styles.finishExerciseButtonText}>FINISH</Text></TouchableOpacity>
      }
    }
    return (
      <View style={styles.app}>
        <StatusBar barStyle='light-content' />
        <View style={styles.statusBar}></View>
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
                      { answer !== '' && this.state.currentAnswer === index && index !== 6 && <TouchableOpacity style={styles.nextButton} onPress={this.next}><Text>next</Text></TouchableOpacity> }
                      { index === 6 && lastButton }
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={styles.past} ref="past">
            <View style={styles.pastContent}>
                <Text style={styles.pastTitle}>Past Exercises</Text>
                {this.state.exercises.length > 0 && <View styles={styles.pastExercises}>
                  {this.state.exercises.map((exercise, index) => (
                    <View style={styles.pastExercise} key={index}>
                      <TouchableHighlight style={styles.pastExerciseButton} onPress={() => this.loadExercise(index)}><Text style={styles.pastExerciseText}>{exercise.answers[0]}</Text></TouchableHighlight>
                      <TouchableHighlight style={styles.deletePastExerciseButton} onPress={() => this.deleteExercise(index)}><Text>Delete</Text></TouchableHighlight>
                    </View>
                  ))}
                </View>}
                <TouchableHighlight style={styles.takeAgainButton} onPress={this.startExercise}><Text style={styles.takeAgainButtonText}>START NEW EXERCISE</Text></TouchableHighlight>
            </View>
          </View>
          <View style={styles.share}>
            <View style={styles.shareTitleView}><Text style={styles.shareTitle}>If you found this exercise useful,</Text><Text style={styles.shareTitleMain}>Share It</Text></View>
            <View style={styles.shareButtons}>
              <TouchableHighlight style={styles.shareButton} onPress={this.shareTwitter}><FontAwesome name="twitter" color="#fff" size={24} /></TouchableHighlight>
              <TouchableHighlight style={styles.shareButton} onPress={this.shareFacebook}><FontAwesome name="facebook" color="#fff" size={24} /></TouchableHighlight>
              <TouchableHighlight style={styles.shareButton} onPress={this.shareLinkedin}><FontAwesome name="linkedin" color="#fff" size={24} /></TouchableHighlight>
              <TouchableHighlight style={styles.shareButton} onPress={this.shareEmail}><MaterialIcons name="email" color="#fff" size={24} /></TouchableHighlight>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with <FontAwesome name="heart" color="#e85454" size={14} /> by Parker Klein</Text>
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
  statusBar: {
    backgroundColor: '#e85454',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 20,
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
    fontWeight: '600',
  },
  why: {
    height: (height/6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
    paddingTop: 10,
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
    paddingBottom: 20,
  },
  exercise: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  exerciseContent: {

  },
  answerContainer: {
    margin: 12,
  },
  answerContent: {
  },
  answerPropmt: {
    marginBottom: 5,
  },
  answerPromptText: {
    color: '#e85454',
    fontWeight: '600',
    fontSize: 16,
  },
  answer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
    minHeight: 40,
  },
  answerText: {
    fontSize: 14,
    color: '#474747',
    lineHeight: 20,
    minHeight: 40,
    padding: 8,
  },
  nextButton: {

  },
  past: {
    minHeight: height/2,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  pastTitle: {
    textAlign: 'center',
    color: '#e85454',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  takeAgainButton: {
    width: width/2,
    backgroundColor: '#e85454',
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeAgainButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  share: {
    height: height/2,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-around',
  },
  shareTitleView: {
  },
  shareTitle: {
    color: '#474747',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 5,
  },
  shareTitleMain: {
    color: '#e85454',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  shareButton: {
    width: width/5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e85454',
    height: width/5,
    borderRadius: width/10,
    margin: 5,
  },
  footer: {
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#474747'
  }
})
