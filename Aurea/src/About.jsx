import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from './App';

class SavingNote extends Component {
  render() {
    return (
      <blockquote className="saving-note">“{this.props.children}”<small>{this.props.author}</small></blockquote>
    );
  }
}
export default function About() {
  return (
    <main className="about">
      <p className="eyebrow">MEET AUREA</p>
      <h1>
        A golden habit.
        <br />
        <em>A calmer tomorrow.</em>
      </h1>
      <p className="subtitle">A personal monthly planner for the money choices that matter.</p>
      <Panel eyebrow="THREE SIMPLE STEPS" title="Plan. Record. Reflect.">
        <ol>
          <li>Set a separate budget for each month.</li>
          <li>Record, edit or remove your dated expenses.</li>
          <li>Explore your calendar and review your remaining budget.</li>
        </ol>
        <p>
          At 80% usage, your budget indicator turns red. Above 100%, the remaining balance becomes negative. Past months show unspent budget or overspending,
          not verified bank savings.
        </p>
      </Panel>
      <SavingNote author="THE AUREA PHILOSOPHY">Make room for tomorrow, one thoughtful choice at a time.</SavingNote>
      <Link className="gold-button" to="/">Back to my month →</Link>
    </main>
  );
}
