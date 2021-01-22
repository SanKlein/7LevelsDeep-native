import React, { Component } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  View,
  Text,
  TextInput,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  loadParker,
  rate,
  share,
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
    this.shareExercise = this.shareExercise.bind(this);
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

  shareExercise(e) {
    let text = '';

    questions.forEach((q, index) => {
      text += `${q}\n`;
      text += `${e[index]}\n\n`;
    });

    Share.share({ message: text });
  }

  render() {
    const { answer, answers, pastAnswers } = this.state;

    const currentAnswer = answers[answer - 1];
    const isLast = answer === 7;
    let nextAnswer = '';
    if (!isLast) {
      nextAnswer = answers[answer];
    }

    if (answer) {
      return (
        <View style={styles.app}>
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
        </View>
      );
    }

    const hasExercises = !!pastAnswers.length;

    return hasExercises ? (
      <View style={styles.app}>
        <ScrollView>
          <Text style={styles.otherTitle}>7 Levels Deep</Text>
          <Text style={styles.introText}>Discover your why</Text>
          <TouchableOpacity style={styles.startOverButton} onPress={this.startExercise}>
            <Text style={styles.startButtonText}>New answer</Text>
          </TouchableOpacity>
          <View style={styles.past}>
            <Text style={styles.pastTitle}>Past answers</Text>
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
                    style={styles.sharePastExerciseButton}
                    onPress={() => this.shareExercise(e)}
                  >
                    <Text style={styles.sharePastExerciseButtonText}>
                      <EvilIcons name="share-apple" color="#333" size={28} />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deletePastExerciseButton}
                    onPress={() => {
                      Alert.alert(
                        'Are you sure you want to delete this answer?',
                        null,
                        [
                          { text: 'No', onPress: () => {} },
                          {
                            text: 'Delete',
                            onPress: () => this.deleteExercise(index),
                            style: 'destructive'
                          }
                        ],
                        { cancelable: false }
                      );
                    }}
                  >
                    <Text style={styles.deletePastExerciseButtonText}>
                      <MaterialIcons name="delete" color="#e85454" size={24} />
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.takeAgainButton} onPress={this.startExercise}>
              <Text style={styles.takeAgainButtonText}>New answer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.share}>
            <View style={styles.shareTitleView}>
              <Text style={styles.shareTitle}>If you found 7 Levels Deep useful,</Text>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={share}>
              <Text style={styles.startButtonText}>Share 7 Levels Deep</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.rateButton} onPress={rate}>
            <Text style={styles.takeAgainButtonText}>Rate 7 Levels Deep</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createdBy} onPress={loadParker}>
            <Text style={styles.createdByText}>Made with</Text>
            <FontAwesome style={styles.heart} name="heart" color="#e85454" size={24} />
            <Text style={styles.createdByText}>by Parker</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    ) : (
      <View style={styles.startApp}>
        <View style={styles.intro}>
          <Text style={styles.title}>7 Levels Deep</Text>
          <Text style={styles.introText}>Discover your why</Text>
        </View>
        <View style={styles.reason}>
          <View style={styles.why}>
            <Text style={styles.whyTitle}>Why?</Text>
            <Text style={styles.whyText}>Discover what drives you to take action</Text>
          </View>
          <View style={styles.instructions}>
            <Text style={styles.whyTitle}>Instructions</Text>
            <Text style={styles.whyText}>Take 5-10 minutes to reflect and answer 7 questions</Text>
          </View>
        </View>
        <View style={styles.start}>
          <TouchableOpacity style={styles.startButton} onPress={this.startExercise}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default App;
