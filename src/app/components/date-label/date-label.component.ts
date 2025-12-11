import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { addDays, addMonths, format, parse } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  standalone: true,
  selector: 'app-date-label',
  templateUrl: './date-label.component.html',
  styleUrls: [ './date-label.component.less' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateLabelComponent),
      multi: true,
    },
  ],
  imports: [ CommonModule, NzDatePickerModule, NzSelectModule, FormsModule ],
  exportAs: 'appDateLabel',
})
export class DateLabelComponent implements ControlValueAccessor, OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  onChange: (value: string[]) => void = () => undefined;

  onTouched: (value: string[]) => void = () => undefined;

  // 今天之前的都不能选
  @Input() nzDisabledDate: (current: Date) => boolean = (current: Date) =>{
    return current > new Date();
  };

  @Input() labelRight = true;

  @Input() customOption: { value: string; label: string; time: Date[] }[] = [];

  @Input() mode: 'date' | 'week' | 'month' | 'year' = 'date';

  formatStr:any = {
    date: 'yyyy-MM-dd',
    week: 'yyyy-ww',
    month: 'yyyy-MM',
    year: 'yyyy',
  };

  date: any = null;

  value: any = null;

  option: { value: string; label: string; time: Date[] }[] = [];

  ngOnInit(): void {
    switch (this.mode) {
      case 'date':
        this.option =
        this.customOption.length > 0
          ? this.customOption
          : [
            {
              value: 'yesterday',
              label: '昨天',
              time: [ addDays(new Date(), -1), addDays(new Date(), -1) ],
            },
            {
              value: 'last_days_3',
              label: '近三天',
              time: [ addDays(new Date(), -3), addDays(new Date(), -1) ],
            },
            {
              value: 'last_days_7',
              label: '近7天',
              time: [ addDays(new Date(), -7), addDays(new Date(), -1) ],
            },
            {
              value: 'last_days_30',
              label: '近30天',
              time: [ addDays(new Date(), -30), addDays(new Date(), -1) ],
            },
            {
              value: 'custom',
              label: '自定义',
              time: [ addDays(new Date(), -40), addDays(new Date(), -1) ],
            },
          ];
        break;
      case 'week':
        this.option =
        this.customOption.length > 0
          ? this.customOption
          : [
            {
              value: 'last_week',
              label: '上周',
              time: [
                addDays(new Date(), -7 - new Date().getDay()),
                addDays(new Date(), -1 - new Date().getDay()),
              ],
            },
            {
              value: 'this_week',
              label: '本周',
              time: [
                addDays(new Date(), -new Date().getDay()),
                addDays(new Date(), -1),
              ],
            },
            {
              value: 'custom',
              label: '自定义',
              time: [
                addDays(new Date(), -7 - new Date().getDay()),
                addDays(new Date(), -1),
              ],
            },
          ];

        break;
      case 'month':
        this.option =
        this.customOption.length > 0
          ? this.customOption
          : [
            {
              value: 'last_month_3',
              label: '近3月',
              // 进三个月
              time: [
                addMonths(new Date(), -3),
                addMonths(new Date(), -1),
              ],

            },
            {
              value: 'last_month_6',
              label: '近6月',
              time: [
                addMonths(new Date(), -6),
                addMonths(new Date(), -1),
              ],
            },
            {
              value: 'custom',
              label: '自定义',
              time: [
                addDays(new Date(), -new Date().getDate()),
                addDays(new Date(), -1),
              ],
            },
          ];

        break;
      case 'year':
        this.option =
        this.customOption.length > 0
          ? this.customOption
          : [
            {
              value: 'last_year_1',
              label: '近一年',
              time: [
                addMonths(new Date(), -12),
                addMonths(new Date(), -1),
              ],
            },
            {
              value: 'last_year_2',
              label: '近两年',
              time: [
                addMonths(new Date(), -24),
                addMonths(new Date(), -1),
              ],
            },
            {
              value: 'custom',
              label: '自定义',
              time: [
                addDays(new Date(), -365),
                addDays(new Date(), -1),
              ],
            },
          ];

        break;
    }
  }

  timeChange() {
    const target = this.option.filter((item) => {
      return this.arraysAreEqual(
        item.time.map((item) => format(item, this.formatStr[this.mode])),
        this.date.map((item: number | Date) => format(item, this.formatStr[this.mode])),
      );
    });
    if (target.length > 0) {
      this.value = target[0].value;
    } else {
      this.value = 'custom';
    }
    this.inputValue();
  }

  radioChange() {
    this.date = this.option.find((item) => item.value === this.value)?.time;
    this.inputValue();
    this.cdr.detectChanges();
  }

  arraysAreEqual(arr1: string | any[], arr2: string | any[]) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  inputValue() {
    const result = this.date.map((item: number | Date) =>
      format(item, this.formatStr[this.mode]),
    );
    this.onChange(result);
  }

  writeValue(value: string[]): void {
    if (value) {
      this.date = [
        parse(value[0], this.formatStr[this.mode], new Date()),
        parse(value[1], this.formatStr[this.mode], new Date()),
      ];
      const target = this.option.filter((item) => {
        return this.arraysAreEqual(
          item.time.map((item) => format(item, this.formatStr[this.mode])),
          this.date.map((item: number | Date) => format(item, this.formatStr[this.mode])),
        );
      });
      if (target.length > 0) {
        this.value = target[0].value;
      }
      this.cdr.detectChanges();
    }
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: string[]) => void): void {
    this.onTouched = fn;
  }
}
