import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  loadParker,
  rate,
  shareTwitter,
  shareLinkedin,
  shareFacebook,
  shareEmail
} from './helpers';
import styles from './styles';

const questions = [
  'What do you want to do?',
  'Why is that important to you?',
  'Why is that important to you?',
  'Why is that important to you?',
  'Why is that important to you?',
  'Why is that important to you?',
  'Why is that important to you?'
];

const initialState = {
  answer: 0,
  answers: new Array(7).fill(''),
  pastAnswers: []
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.startExercise = this.startExercise.bind(this);
    this.changeAnswer = this.changeAnswer.bind(this);
    this.next = this.next.bind(this);
    this.loadExercise = this.loadExercise.bind(this);
    this.deleteExercise = this.deleteExercise.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem('levelsStore')
      .then(value => {
        if (value && value.length) {
          this.setState(JSON.parse(value));
        }
      })
      .catch(() => null);
  }

  componentDidUpdate() {
    AsyncStorage.setItem('levelsStore', JSON.stringify(this.state));
  }

  startExercise() {
    this.setState({
      answer: 1,
      answers: initialState.answers
    });
  }

  changeAnswer(text) {
    const { answer, answers } = this.state;
    this.setState({
      answers: [...answers.slice(0, answer - 1), text, ...answers.slice(answer)]
    });
  }

  next(answer) {
    const { answers, pastAnswers } = this.state;
    if (answer > 7) {
      this.setState({
        pastAnswers: [...(pastAnswers || []), answers],
        answers: initialState.answers,
        answer: 0
      });
      fetch('https://www.7levelsdeep.com/api/count', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
      });
      return;
    }
    this.setState({ answer });
  }

  loadExercise(index) {
    const { pastAnswers } = this.state;
    const answers = pastAnswers[index];
    this.setState({ answers, answer: 1 });
  }

  deleteExercise(index) {
    const { pastAnswers } = this.state;
    this.setState({
      answer: 0,
      pastAnswers: [...pastAnswers.slice(0, index), ...pastAnswers.slice(index + 1)]
    });
  }

  render() {
    const { answer, answers, pastAnswers } = this.state;

    const currentAnswer = answers[answer - 1];

    if (answer) {
      return (
        <SafeAreaView style={styles.app}>
          <View style={styles.answerContainer}>
            <Text style={styles.answerPromptText}>
              {answer}
              . {questions[answer - 1]}
            </Text>
            <View style={styles.answer}>
              <TextInput
                autoFocus
                style={styles.answerText}
                multiline
                value={currentAnswer}
                onChangeText={text => this.changeAnswer(text)}
                returnKeyType="next"
                selectionColor="#474747"
              />
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.backButton} onPress={() => this.next(answer - 1)}>
              <Text style={styles.backButtonText}>BACK</Text>
            </TouchableOpacity>
            {!!currentAnswer && (
              <TouchableOpacity
                style={styles.finishExerciseButton}
                onPress={() => this.next(answer + 1)}
              >
                <Text style={styles.finishExerciseButtonText}>
                  {answer === 7 ? 'FINISH' : 'NEXT'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <KeyboardSpacer />
        </SafeAreaView>
      );
    }

    const hasExercises = !!pastAnswers.length;

    return hasExercises ? (
      <SafeAreaView style={styles.app}>
        <ScrollView>
          <Text style={styles.otherTitle}>7 Levels Deep</Text>
          <Text style={styles.introText}>Discover Your Why</Text>
          <TouchableOpacity style={styles.startOverButton} onPress={this.startExercise}>
            <Text style={styles.startButtonText}>START OVER</Text>
          </TouchableOpacity>
          <View style={styles.past}>
            <Text style={styles.pastTitle}>Past Answers</Text>
            <View style={styles.pastExercises}>
              {pastAnswers.map((e, index) => (
                <View style={styles.pastExercise} key={`answers${index + 1}`}>
                  <TouchableOpacity
                    style={styles.pastExerciseButton}
                    onPress={() => this.loadExercise(index)}
                  >
                    <Text style={styles.pastExerciseText} ellipsizeMode="tail" numberOfLines={1}>
                      {e[0]}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deletePastExerciseButton}
                    onPress={() => this.deleteExercise(index)}
                  >
                    <Text style={styles.deletePastExerciseButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.takeAgainButton} onPress={this.startExercise}>
              <Text style={styles.takeAgainButtonText}>START NEW ANSWER</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.share}>
            <View style={styles.shareTitleView}>
              <Text style={styles.shareTitle}>If you found 7 Levels Deep useful,</Text>
              <Text style={styles.shareTitleMain}>Share It</Text>
            </View>
            <View style={styles.shareButtons}>
              <TouchableOpacity style={styles.shareButton} onPress={shareTwitter}>
                <FontAwesome name="twitter" color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={shareFacebook}>
                <FontAwesome name="facebook" color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={shareLinkedin}>
                <FontAwesome name="linkedin" color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={shareEmail}>
                <MaterialIcons name="email" color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.rateButton} onPress={rate}>
            <Text style={styles.startButtonText}>RATE 7 LEVELS DEEP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createdBy} onPress={loadParker}>
            <Text style={styles.createdByText}>Created by Parker</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={styles.startApp}>
        <View style={styles.intro}>
          <Text style={styles.title}>7 Levels Deep</Text>
          <Text style={styles.introText}>Discover Your Why</Text>
        </View>
        <View style={styles.reason}>
          {!hasExercises && (
            <View style={styles.why}>
              <Text style={styles.whyTitle}>WHAT?</Text>
              <Text style={styles.whyText}>Answer 7 questions</Text>
            </View>
          )}
          {!hasExercises && (
            <View style={styles.instructions}>
              <Text style={styles.whyTitle}>WHY?</Text>
              <Text style={styles.whyText}>Discover why you take action</Text>
            </View>
          )}
        </View>
        <View style={styles.start}>
          <TouchableOpacity style={styles.startButton} onPress={this.startExercise}>
            <Text style={styles.startButtonText}>{hasExercises ? 'START OVER' : 'START'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export default App;
