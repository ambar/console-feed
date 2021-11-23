import React from 'react'
import { render } from 'react-dom'
import update from 'immutability-helper'
import { Hook, Console, Decode } from '../../src'

const iframe = document.createElement('iframe')
iframe.src = './iframe.html'
document.body.appendChild(iframe)

class App extends React.Component {
  state = {
    isDarkMode: true,
    fontSize: 10,
    logs: [
      {
        method: 'result',
        data: ['Result'],
      },
      {
        method: 'command',
        data: ['Command'],
      },
    ] as any[],
    filter: [],
    searchKeywords: '',
  }

  componentDidMount() {
    Hook((iframe.contentWindow as any).console, (log) => {
      const decoded = Decode(log)
      this.setState((state) => update(state, { logs: { $push: [decoded] } }))
    })
  }

  switch = () => {
    const filter = this.state.filter.length === 0 ? ['log'] : []
    this.setState({
      filter,
    })
  }

  handleKeywordsChange = ({ target: { value: searchKeywords } }) => {
    this.setState({ searchKeywords })
  }

  render() {
    const { isDarkMode, fontSize } = this.state
    return (
      <div
        style={{
          color: isDarkMode ? '#fff' : '#242424',
          backgroundColor: isDarkMode ? '#242424' : '#fff',
        }}
      >
        <div>
          <button onClick={this.switch.bind(this)}>Show only logs</button>
          <input placeholder="search" onChange={this.handleKeywordsChange} />
          <input
            type="range"
            min={10}
            max={50}
            value={fontSize}
            onChange={(e) => {
              this.setState({ fontSize: Number(e.target.value) })
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(e) => {
                this.setState({ isDarkMode: e.target.checked })
              }}
            />
            Toggle dark mode
          </label>
        </div>

        <Console
          logs={this.state.logs}
          variant={isDarkMode ? 'dark' : 'light'}
          styles={{
            BASE_FONT_SIZE: fontSize,
          }}
          filter={this.state.filter}
          searchKeywords={this.state.searchKeywords}
        />
      </div>
    )
  }
}

render(<App />, document.querySelector('#demo'))
