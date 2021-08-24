export declare enum CasingType {
    flat = "flat",
    camel = "camel",
    pascal = "pascal",
    kebab = "kebab",
    cobol = "cobol",
    snake = "snake",
    macro = "macro"
}
export declare type Options = {
    type: CasingType;
    disallowDigits?: boolean;
    separator?: {
        char: string;
        allowLeading?: boolean;
    };
};
declare const _default: import("@stoplight/spectral-core").RulesetFunctionWithValidator<string, Options>;
export default _default;
