
namespace Question {
  export interface Input {
    readonly id: string;
    readonly type: 'images' | 'text' | 'checkbox';
    readonly options: Options;
  }

  export interface ImagesOptions {
    readonly required: boolean;
    readonly hint?: string;

    readonly images: Array<{

      readonly id: string;

      readonly url: string;

      /// Will also be used for aria-label
      readonly title: string;

      readonly alt: string;
    }>;
  }

  export interface CheckboxOptions {
    readonly required: boolean;
    readonly label: string;
    readonly defaultValue: boolean;
    readonly hint?: string;
    readonly checkedHint?: string;
    readonly uncheckedHint?: string;
  }

  export interface TextOptions {
    readonly kind: 'text' | 'textfield' | 'email';
    readonly label?: string;
    readonly placeholder?: string;
    readonly hint?: string;
    readonly minimumCharacters?: number;
    readonly maximumCharacters?: number;
    readonly autoCapitalize?: 'characters' | 'words' | 'sentences';
  }

  export type Options = ImagesOptions | TextOptions | CheckboxOptions;
}

interface Question {

  readonly title?: string;

  readonly inputs: Array<Question.Input[] | Question.Input>;

}

export default Question;
