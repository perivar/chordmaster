// https://github.com/g6ling/react-native-html-parser
declare module "react-native-html-parser" {
  export class DOMParser {
    parseFromString: (xmlSource: string, mimeType: string) => Document;
  }

  export class Document {
    querySelect: (query: string) => string; // querySelect only support tagName,className,Attribute,id, parent descendant
  }
}
