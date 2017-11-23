
namespace Question {
  export interface Input {
    readonly type: InputType;
    readonly options: Options;
  }

  export enum InputType {
    Images,
    Text,
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

  export interface TextOptions {
    readonly label: string;
    readonly allowMultipleLines: boolean;
    readonly placeholder?: string;
    readonly hint?: string;
    readonly minimumCharacters?: number;
    readonly maximumCharacters?: number;
  }

  export type Options = ImagesOptions | TextOptions;
}

interface Question {

  readonly id: string;

  readonly title?: string;

  readonly inputs: Question.Input[];

}

export default Question;
