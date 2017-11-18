
namespace Question {
  export enum InputType {
    Images,
    TextField,
    TextBox,
  }

  export interface ImagesOptions {
    readonly images: Array<{

      readonly id: string;

      readonly url: string;

      /// Will also be used for aria-label
      readonly title: string;

      readonly alt: string;
    }>;
  }

  export interface TextFieldOptions {
    readonly placeholder?: string;
    readonly minimumCharacters?: number;
    readonly maximumCharacters?: number;
  }

  export interface TextBoxOptions extends TextFieldOptions {}
}

interface Question {

  readonly id: string;

  readonly title: string;

  readonly input: {
    readonly type: Question.InputType;
    readonly options: Question.ImagesOptions | Question.TextFieldOptions | Question.TextBoxOptions;
  }

}

export default Question;
