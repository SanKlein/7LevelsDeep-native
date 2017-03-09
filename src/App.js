import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableHighlight, AsyncStorage, TextInput } from 'react-native'

const questions = ['What do you want to do?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?', 'Why is that important to you?']

export default class App extends Component {
  constructor(props) {
    super(props);

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
    this.onEnter = this.onEnter.bind(this)
    this.removeOnEnter = this.removeOnEnter.bind(this)
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
    const exercise = this.state.exercise
    const index = exercise.answers.findIndex(answer => answer === '') // gets first blank answer index
    if (index !== -1) {
      const answers = exercise.answers.slice(0, index + 1) // removes answers past the first blank answer
      // removes blank answers from state
      this.setState({
        exercise: {
          ...exercise,
          answers: answers
        },
        currentAnswer: index
      })
    }

    const self = this

    this.setState({ isStoreLoading: true })

    AsyncStorage.getItem('deepStore').then(value => {
      (value && value.length) ? self.setState({ exercises: JSON.parse(value) }) : self.setState({ exercises: [] })
      self.setState({ isStoreLoading: false })
    }).catch(error => {
      self.setState({ isStoreLoading: false })
    })
  }

  // runs after initial mount
  componentDidMount() {
    if (this.state.started) { // check if started
      const currentAnswer = this.state.currentAnswer
      // const elem = document.getElementById(currentAnswer.toString())
      if (currentAnswer === 0) { // on first answer
        // jump(document.getElementById('exercise'), {
        //   duration: 1000,
        //   callback: () => this.focusElem(currentAnswer.toString())
        // })
      } else { // past first answer
        const id = 'answer' + (currentAnswer - 1)
        // jump(document.getElementById(id), {
        //   duration: 1000,
        //   callback: () => this.focusElem(currentAnswer.toString())
        // })
      }
    } else {
      // document.getElementById('0').addEventListener('focus', this.removeOnEnter) // adds event listener for focus on first answer
      // document.addEventListener('keypress', this.onEnter) // global event which will focus on first answer if enter button pressed
    }
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
    const answers = document.querySelectorAll('.answer')
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i]
      answer.style.height = answer.scrollHeight + "px"
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // runs when enter button is originally pressed to start exercise
  onEnter(e) {
    if (e.keyCode === 13) { // if enter button pressed
      this.startExercise() // start exercise
      // document.removeEventListener('keypress', this.onEnter) // remove onEnter event listener
    }
  }

  // removes onEnver event listener on focus of first answer
  removeOnEnter() {
    // document.removeEventListener('keypress', this.onEnter) // remove onEnter event listener
    // document.getElementById('0').removeEventListener('focus', this.removeOnEnter) // remove focus event listener from first answer input
  }

  // focuses on element
  focusElem(id) {
    // const elem = document.getElementById(id)
    // elem.focus()
  }

  // starts exercise
  startExercise() {
    // create new exercise and sets started to true
    this.setState({
      exercise: {
        date: Date.now(),
        answers: ['']
      },
      started: true,
      editing: false
    })
    // jump(document.getElementById('exercise'), {
    //   duration: 1000,
    //   callback: () => this.focusElem('0')
    // })
    this.removeOnEnter() // remove onEnter event listener
  }

  // sets currentAnser index to the focused answer's index
  setCurrent(index) {
    this.setState({
      currentAnswer: index
    })
    // const elem = document.getElementById(index)
    // elem.style.height = elem.scrollHeight + "px";
    // const val = elem.value
    // elem.value = ''
    // elem.value = this.capitalizeFirstLetter(val)
  }

  // handle when key down on text area is enter button
  handleEnter(e, index) {
    if (e.keyCode === 13) { // enter button keyCode = 13
      this.next(e, index)
    }
  }

  // runs when answer is changed
  changeAnswer(index) {
    this.setState({
      exercise: {
        ...this.state.exercise,
        answers: [
          ...this.state.exercise.answers.slice(0, index),
          this.capitalizeFirstLetter(e.target.value),
          ...this.state.exercise.answers.slice(index + 1)
        ]
      },
      currentAnswer: index
    })
    // const elem = document.getElementById(index)
    // elem.style.height = elem.scrollHeight + "px";
  }

  // runs on enter when focused on answer
  next(e, index) {
    // e.preventDefault() // prevent default event
    // const state = this.state
    // const currentAnswer = state.currentAnswer
    // const exercise = state.exercise
    // let answers = exercise.answers
    // const answer = answers[currentAnswer]
    // if (answer === '') { // if current answer is empty
    //   this.focusElem(currentAnswer.toString())
    //   return
    // }
    // const answersLength = answers.length
    // if (index === 6) { // last button clicked
    //   let exercises = state.exercises
    //   if (!state.editing) { // not editing
    //     axios.post('/api/count')
    //     this.setState({
    //       exercises: exercises.concat([exercise]),
    //       exercise: {
    //         date: Date.now(),
    //         answers: ['']
    //       },
    //       started: false,
    //       currentAnswer: 0
    //     }, () => jump(document.getElementById('past'), {
    //       duration: 700
    //     }))
    //     ReactGA.event({
    //       category: 'Exercise',
    //       action: 'Finish',
    //       label: 'Finish Exercise'
    //     })
    //   } else { // we are editing
    //     const editIndex = exercises.findIndex(e => e.date === exercise.date) // find exercise with the same date
    //     if (editIndex === -1) { // could not find the exercise we were editing
    //       this.setState({
    //         exercises: exercises.concat([exercise]),
    //         exercise: {
    //           date: Date.now(),
    //           answers: ['']
    //         },
    //         started: false,
    //         editing: false,
    //         currentAnswer: 0
    //       }, () => jump(document.getElementById('past'), {
    //         duration: 700
    //       }))
    //     } else { // add new exercise to exercises and reset exercise
    //       exercises = [
    //         ...exercises.slice(0, editIndex),
    //         exercise,
    //         ...exercises.slice(editIndex + 1)
    //       ]
    //       this.setState({
    //         exercises: exercises,
    //         exercise: {
    //           date: Date.now(),
    //           answers: ['']
    //         },
    //         started: false,
    //         editing: false,
    //         currentAnswer: 0
    //       }, () => jump(document.getElementById('past'), {
    //         duration: 700
    //       }))
    //     }
    //   }
    // } else { // not on last question
    //   if (this.isMobile()) {
    //     if (currentAnswer === answersLength - 1) { // no answers ahead of the current answer
    //       answers = answers.concat([''])
    //       this.setState({
    //         exercise: {
    //           ...exercise,
    //           answers: answers
    //         },
    //         currentAnswer: answersLength
    //       }, () => this.focusElem(answersLength.toString()))
    //       return
    //     } else { // current answer is not the last answer answered
    //       const nextAnswer = currentAnswer + 1
    //       this.setState({
    //         currentAnswer: currentAnswer + 1
    //       }, () => this.focusElem(nextAnswer))
    //     }
    //   } else {
    //     if (currentAnswer === answersLength - 1) { // no answers ahead of the current answer
    //       answers = answers.concat([''])
    //       this.setState({
    //         exercise: {
    //           ...exercise,
    //           answers: answers
    //         },
    //         currentAnswer: answersLength
    //       })
    //       jump(document.getElementById('answer' + (currentAnswer)), {
    //         duration: 700,
    //         callback: () => this.focusElem(answersLength.toString())
    //       })
    //       return
    //     } else { // current answer is not the last answer answered
    //       const nextAnswer = currentAnswer + 1
    //       this.setState({
    //         currentAnswer: currentAnswer + 1
    //       })
    //       const Id = 'answer' + currentAnswer
    //       jump(document.getElementById(Id), {
    //         duration: 700,
    //         callback: () => this.focusElem(nextAnswer)
    //       })
    //     }
    //   }
    // }
  }

  // load past exercise
  loadExercise(index) {
    const exercise = this.state.exercises[index]
    this.setState({
      ...this.state,
      exercise: exercise,
      editing: true,
      started: true
    })
    // jump(document.getElementById('answer0'), {
    //   duration: 700,
    //   callback: () => this.focusElem('0')
    // })
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
        lastButton = <TouchableHighlight className="last-button" title="save exercise" type="submit"><Text>SAVE</Text></TouchableHighlight>
      } else {
        lastButton = <TouchableHighlight className="last-button" title="finish exercise" type="submit"><Text>FINISH</Text></TouchableHighlight>
      }
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View className="intro">
          <View className="home-screen">
            <Text className="title">7 Levels Deep</Text>
            <Text className="description">Discover Your Why</Text>
            <View className="start-buttons">
              <View className="start"></View>
              <TouchableHighlight className="start-button" title="start exercise" onClick={this.startExercise}><Text>START EXERCISE</Text></TouchableHighlight>
              <Text className="enter-help">press ENTER</Text>
            </View>
          </View>
        </View>
        <View id="exercise" className="why">
          <View className="instruction-info">
            <Text className="why-title">WHY?</Text>
            <Text className="why-description">Discover what drives you to take action</Text>
          </View>
        </View>
        <View className="instructions">
          <View className="instruction-info">
            <Text className="instructions-title">INSTRUCTIONS</Text>
            <Text className="instructions-description">Take 10-15 minutes to reflect and answer 7 questions</Text>
          </View>
        </View>
        <View className="exercise">
          <View className="small-info">
            <View className="current-exercise">
              {this.state.exercise.answers.map((answer, index) => {
                const answerID = "answer" + index
                return (
                  <View className="answer-div" key={index} id={answerID}>
                    <View className="answer-form" onSubmit={(e) => this.next(e, index)}>
                      <View className="prompt"><Text className="number">{index + 1}.</Text><Text className="question">{questions[index]}</Text></View>
                      <View className="answer-section">
                        <TextInput className="answer" type="text" id={index} name={index} value={answer} onKeyDown={(e) => this.handleEnter(e, index)} onChange={(e) => this.changeAnswer(e, index)} onFocus={(e) => this.setCurrent(e, index)} autoComplete="off" />
                      </View>
                      { answer !== '' && this.state.currentAnswer === index && index !== 6 && <TouchableHighlight className="next-button" type="submit"><Text>press ENTER</Text></TouchableHighlight> }
                      { index === 6 && lastButton }
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        </View>
        <View id="past">
          <View className="info">
            <View className="exercise-content">
              <Text className="exercise-title">Past Exercises</Text>
              {this.state.exercises.length > 0 && <View className="past-exercises">
                {this.state.exercises.map((exercise, index) => (
                  <View className="past-exercise" key={index}>
                    <TouchableHighlight className="exercise-date" onPress={(e) => this.loadExercise(e, index)}><Text>{exercise.answers[0]}</Text></TouchableHighlight>
                    <TouchableHighlight className="exercise-delete" onPress={(e) => this.deleteExercise(e, index)}><Text>Delete</Text></TouchableHighlight>
                  </View>
                ))}
              </View>}
              <TouchableHighlight className="take-again" onClick={this.startExercise} title="start exercise"><Text>START NEW EXERCISE</Text></TouchableHighlight>
            </View>
          </View>
        </View>
        <View className="share">
          <View className="small-info">
            <View className="share-title"><Text className="share-title-word">If you found this exercise useful, Share It</Text></View>
            <View className="social-buttons">
              <TouchableHighlight className="social-button" title="share to twitter" onPress={this.shareTwitter}><Text>Twitter</Text></TouchableHighlight>
              <TouchableHighlight className="social-button" title="share to facebook" onPress={this.shareFacebook}><Text>Facebook</Text></TouchableHighlight>
              <TouchableHighlight className="social-button" title="share to linkedin" onPress={this.shareLinkedin}><Text>Linkedin</Text></TouchableHighlight>
              <TouchableHighlight className="social-button" title="send email" onPress={this.shareEmail}><Text>Email</Text></TouchableHighlight>
            </View>
          </View>
        </View>
        <View className="footer">
          <Text className="footer-info">Made with heart by Parker Klein</Text>
        </View>
      </ScrollView>
    )
  }
}
