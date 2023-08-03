import {IInputs, IOutputs} from "./generated/ManifestTypes";

import VMasker = require("vanilla-masker");

export class InputMask implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _maskPattern: string;
    private _firstMaskPattern: string;
    private _default: string;
    private _firstDefault: string;
    private _notifyOutputChanged: () => void;
    private _inputElement: HTMLInputElement;
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _rawValue: string;
    private _maskedValue: string;
    private _isValid: string;


    /**
     * Empty constructor.
     */
    constructor()
    {
        
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this._context = context;
        this._isValid = this._context.parameters.Valid.raw!;
        this._container = document.createElement("div");
        this._container.classList.add("container");
        this._notifyOutputChanged = notifyOutputChanged;

        this._inputElement = document.createElement("input");
        this._inputElement.setAttribute("type", "text");
        this._inputElement.setAttribute("id", "data-js-input");
        this._inputElement.addEventListener("change", this.handleOnChanged.bind(this));

        this._default = this._context.parameters.default.raw!;
        this._firstDefault = this._context.parameters.default.raw!;
        this._firstMaskPattern = this._context.parameters.maskPattern.raw!;
        this._inputElement.setAttribute(
            "value",
            this._default ? this._default : ""
        );

        this._container.appendChild(this._inputElement);
        container.appendChild(this._container);
    }

    public handleOnChanged(): void {
        const pattern = this._context.parameters.maskPattern.raw!;
        const value = this._inputElement.value;

        if(this._context.parameters.Required.raw == "Yes") {
            if(value == "") {
                this._default = "";
                this._maskedValue = "";
                this._rawValue = "";
                this._isValid = "No";
                this.updateStyles(false);
                this._notifyOutputChanged();
            } else {
                if(this.validateInputWithPattern(value, pattern)) {
                    this._default = this._inputElement.value;
                    this._maskedValue = this._inputElement.value;
                    this._rawValue = this._inputElement.value;
                    this._isValid = "Yes";
                    this.updateStyles(true);
                    this._notifyOutputChanged();
                } else {
                    this._default = this._inputElement.value;
                    this._maskedValue = "";
                    this._rawValue = "";
                    this._isValid = "No";
                    this.updateStyles(false);
                    this._notifyOutputChanged();
                }
            }
        } else {
            if(value == "") {
                this._default = "";
                this._maskedValue = "";
                this._rawValue = "";
                this._isValid = "Yes";
                this.updateStyles(true);
                this._notifyOutputChanged();
            } else {
                if(this.validateInputWithPattern(value, pattern)) {
                    this._default = this._inputElement.value;
                    this._maskedValue = this._inputElement.value;
                    this._rawValue = this._inputElement.value;
                    this._isValid = "Yes";
                    this.updateStyles(true);
                    this._notifyOutputChanged();
                } else {
                    this._default = this._inputElement.value;
                    this._maskedValue = "";
                    this._rawValue = "";
                    this._isValid = "No";
                    this.updateStyles(false);
                    this._notifyOutputChanged();
                }
            }
        }
    }

    public validateInputWithPattern(inputString: string, pattern: string): boolean {
        const patternParts = pattern.split('');
        const inputParts = inputString.split('');
    
        if (patternParts.length !== inputParts.length) {
            return false; // Length mismatch
        }
    
        for (let i = 0; i < patternParts.length; i++) {
            const patternChar = patternParts[i];
            const inputChar = inputParts[i];
    
            if (patternChar === '9' && !/\d/.test(inputChar)) {
                return false;  // Digit is expected, but non-digit found
            } else if (patternChar === 'A' && !/[A-Za-z]/.test(inputChar)) {
                return false;  // Letter is expected, but non-letter found
            } else if (patternChar !== '9' && patternChar !== 'A' && patternChar !== inputChar) {
                return false;  // Mismatch with fixed pattern character
            }
        }
    
        return true;
    }    

    public updateStyles(isValid: boolean): void {
        this._inputElement.style.fontSize = this._context.parameters.fontSize.raw!;
        this._inputElement.style.fontFamily = this._context.parameters.fontFamily.raw!;
        this._inputElement.style.fontStyle = this._context.parameters.fontStyle.raw!;
        this._inputElement.style.fontWeight = this._context.parameters.fontWeight.raw!;
        this._inputElement.style.paddingLeft = this._context.parameters.paddingLeft.raw!;
        this._inputElement.style.paddingTop = this._context.parameters.paddingTop.raw!;
        this._inputElement.style.paddingRight = this._context.parameters.paddingRight.raw!;
        this._inputElement.style.paddingBottom = this._context.parameters.paddingBottom.raw!;
        this._inputElement.style.borderWidth = this._context.parameters.borderWidth.raw!;
        this._inputElement.style.borderColor = this._context.parameters.borderColor.raw!;
        this._inputElement.style.borderStyle = this._context.parameters.borderStyle.raw!;
        this._inputElement.style.borderRadius = this._context.parameters.borderRadius.raw!;
        this._inputElement.style.textAlign = this._context.parameters.TextAlign.raw!;

        if(isValid) {
            this._inputElement.style.borderColor = this._context.parameters.borderColor.raw!;
        } else {
            this._inputElement.style.borderColor = "#ff0000";
        }
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        this._context = context;
        //this._default = this._context.parameters.default.raw!;

        if(this._context.parameters.default.raw != this._firstDefault) {
            this._default = this._context.parameters.default.raw!;
            this._firstDefault = this._context.parameters.default.raw!;
            this._rawValue = this._context.parameters.default.raw!;
            this._maskedValue = this._context.parameters.default.raw!;
            this._notifyOutputChanged();
        }

        if(this._context.parameters.maskPattern.raw != this._firstMaskPattern) {
            this._context.parameters.default.raw = "";
            this._firstDefault = "";
            this._default = "";
            this._firstMaskPattern = this._context.parameters.maskPattern.raw!;
            this._rawValue = "";
            this._maskedValue = "";
            this._notifyOutputChanged();
        }

        this._maskPattern = this._context.parameters.maskPattern.raw!;
        this._inputElement.value = this._default ? this._default : "";
        VMasker(this._inputElement).maskPattern(this._maskPattern);
        this.updateStyles(true);

        //this.validateInputWithPattern(this._inputElement.value, this._maskPattern);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            default: this._default,
            rawValue: this._rawValue ? this._rawValue : this._context.parameters.default.raw!,
            maskedValue: this._maskedValue ? this._maskedValue : this._context.parameters.default.raw!,
            Valid: this._isValid ? this._isValid : this._context.parameters.Valid.raw!
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        this._inputElement.removeEventListener("change", this.handleOnChanged);
    }
}