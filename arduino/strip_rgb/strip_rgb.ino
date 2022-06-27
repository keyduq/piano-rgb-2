//define pins for the red, green and blue LEDs
#define RED_LED 6
#define BLUE_LED 5
#define GREEN_LED 9

String inputData = "";
bool dataComplete = false;
bool firstBoot = true;
const char d[2] = ",";
int red = 0;
int green = 0;
int blue = 0;
bool pressed = false;


void setup() {
  Serial.begin(9600);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  rgbColor(red, green, blue);
}

void loop() {
  if (dataComplete) {
    processInput(inputData);
    rgbColor(red, green, blue);
    inputData = "";
    dataComplete = false;
  }
}

void rgbColor(int red_light_value, int green_light_value, int blue_light_value) {
  analogWrite(RED_LED, red_light_value);
  analogWrite(GREEN_LED, green_light_value);
  analogWrite(BLUE_LED, blue_light_value);
}

void processInput(String data) {
  char pCh[11];
  strcpy(pCh, data.c_str());

  char * rgb[3];
  int index = 0;
  
  char *token;
  
  token = strtok(pCh, d);
  
  while(token != NULL) {
    rgb[index] = (char *) malloc(strlen(token) + 1);
    strcpy(rgb[index], token);
    
    index++;
    
    token = strtok(NULL, d);
  }
  red = strtol(rgb[0], NULL, 10);
  green = strtol(rgb[1], NULL, 10);
  blue = strtol(rgb[2], NULL, 10);

  free(rgb[0]);
  free(rgb[1]);
  free(rgb[2]);
}

void serialEvent() {
  while(Serial.available()) {
    char ch = Serial.read();
    if (ch == '\n') {
      dataComplete = true;
      return;
    }
    inputData += ch;

  }
}