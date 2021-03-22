import qrcode from 'qrcode';

export default class Qr {
  public qrCanvas: HTMLCanvasElement;
  public qrText: string;
  activate(model: { qrText: string }) {
    this.qrText = model.qrText;
  }
  attached() {
    qrcode.toCanvas(this.qrCanvas, this.qrText);
  }
}
