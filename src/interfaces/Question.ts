
namespace Question {
  export interface Input {
    readonly type: 'images' | 'text';
    readonly options: Options;
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
    readonly allowMultipleLines: boolean;
    readonly label?: string;
    readonly placeholder?: string;
    readonly hint?: string;
    readonly minimumCharacters?: number;
    readonly maximumCharacters?: number;
  }

  export type Options = ImagesOptions | TextOptions;
}

interface Question {

  readonly title?: string;

  readonly inputs: Question.Input[];

}

export default Question;
