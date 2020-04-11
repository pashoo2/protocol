import React from 'react';
import { SensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage';

const storageK = 'key';

export class SensitiveDataStorage extends React.PureComponent {
  public state = {
    value: '',
    pinCode: undefined as string | undefined,
    isConnected: false,
  };

  public st = new SensitiveDataSessionStorage();

  public onValueChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = ev;
    const { value } = target;

    this.setState({
      value,
    });
  };

  public saveValue = async () => {
    await this.st.setItem(storageK, this.state.value);
  };

  public readValue = async () => {
    const value = await this.st.getItem(storageK);

    console.log(`value = ${value}`);
    this.setState({
      value,
    });
  };

  public async componentDidMount() {
    const pinCode = prompt('Pin code') || undefined;

    this.setState({
      pinCode,
    });
    await this.st.connect({
      pinCode,
    });
    this.setState({
      isConnected: true,
    });
  }

  public render() {
    const { value, isConnected } = this.state;

    return (
      <div>
        <input type="text" onChange={this.onValueChange} value={value} />
        <button onClick={this.saveValue}>Save</button>
        <button onClick={this.readValue} disabled={!isConnected}>
          Read
        </button>
      </div>
    );
  }
}
