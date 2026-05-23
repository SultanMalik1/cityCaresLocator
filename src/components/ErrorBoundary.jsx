import { Component } from "react"
import Message from "./Message"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <Message
          message={
            this.state.error?.message ||
            "Something went wrong loading this page."
          }
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
